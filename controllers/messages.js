import crypto from "crypto";
import twilio from "twilio";
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import ChatRoom from "../models/ChatRoom.js";
import Messages from "../models/Messages.js";
import axios from 'axios'
import Limits from './limit.js';
import {auth} from "../Middlewares/auth_help.js";
import { uploadimage } from "../Middlewares/cloudinary.js";
import { uploadraw } from "../Middlewares/cloudinary_raw.js";
import { send } from "../Middlewares/notification.js";

const router = express.Router();

dotenv.config('../');

/* export const addroom = async (req,res) => {
    try{
        console.log(req.body);
        
        const {phone,country_code}=req.body;
        console.log(phone);
        const existingUser = await User.findOne({phone:phone});
        console.log("got it");
        if(!existingUser){
            return res.status(400).send({ msg:'User does not exists'});
        }
        if(existingUser.blocklist.includes(req.userId._id))
        {
            return res.status(400).send({ msg:'User has blocked you'});
        }
        if(req.userId.blocklist.includes(existingUser._id))
        {
            return res.status(400).send({ msg:'You have blocked the user'});
        }
        const existingchatroom = await ChatRoom.findOne({members: { $all: [req.userId._id, existingUser._id] }});
        if(existingchatroom)
        {
            return res.status(400).send({ msg:'Already added'});
        }
        const chatroom = await ChatRoom.create({members:[req.userId._id, existingUser._id]})
        return res.status(200).send("Added"); 

       
    }
    catch(error){
        return res.status(400).send(error);
    }

}


export const getroom = async (req,res) => {
    const existingchatroom = await ChatRoom.find({members: req.userId._id });
    if(existingchatroom)
    {
        return res.status(200).send( existingchatroom);
    }
    return res.status(400).send({ msg:'Could not find any chats'});

} */



export const addroom = async (req,res) => {
    try{
       
        
        const {phone,country_code}=req.body;
     
        const existingUser = await User.findOne({phone:phone});
        const reqUser = await User.findOne({_id:req.userId._id});
       
        if(!existingUser){
            return res.status(400).send({ msg:'User does not exists'});
        }
        if(existingUser.blocklist.includes(req.userId._id))
        {
            return res.status(400).send({ msg:'User has blocked you'});
        }
        if(reqUser.blocklist.includes(existingUser._id))
        {
            return res.status(400).send({ msg:'You have blocked the user'});
        }

        if(reqUser.contacts.includes(existingUser._id))
        {
            return res.status(400).send({ msg:'Already added'});
        }
        

        reqUser.contacts.push(existingUser._id);
        existingUser.contacts.push(reqUser._id);
        reqUser.save();existingUser.save();
        
        return res.status(200).send("Added"); 

       
    }
    catch(error){
        return res.status(400).send(error);
    }

}


export const getroom = async (req,res) => {
    try{
        const reqUser = await User.findOne({_id:req.userId._id});
        const contacts = await User.find({_id:{ $in: reqUser.contacts}});
        return res.status(400).send(contacts);
    }
    catch(error){
        return res.status(400).send({error});
    }

    return res.status(400).send({ msg:'Could not find any chats'});

}
export const getrecent = async (req,res) => {
 
    const reqUser = await User.findOne({_id:req.userId._id});
    const contacts = await User.find({_id:{ $in: reqUser.contacts}});
    let result=[];
    
    try{
        const reqUser = await User.findOne({_id:req.userId._id});
        const contacts = await User.find({_id:{ $in: reqUser.contacts}});
        let result=[];
        for(let i=0;i<contacts.length;i++)
    {
        const recentmsg = await Messages.findOne({senderid:{ $in: [reqUser._id,contacts[i]._id]},receiverid:{ $in: [reqUser._id,contacts[i]._id]}}).sort({createdDate: -1});
        if(recentmsg){
        const temp = {
            recentmessage:recentmsg,
            contact:contacts[i],
        }
        result.push(temp);}
        else{
            const temp = {
                recentmessage:null,
                contact:contacts[i],
            }
            result.push(temp);
        }
    }
        return res.status(200).send(result);
    }
    catch(error){
        console.log(error);
        return res.status(400).send({error});
    }


}

export const sendmessage = async (req,res) => {
    try{
      
    
        const data=await auth(req,res);
    
        const recid = req.query.recid;
    
        const recentmsg = await Messages.create({
            senderid:data.user._id,
            receiverid:recid,
        })
        
        if(req.file)
               {
                   if(req.file.mimetype==='image/jpeg')
                   {
                   const result = await uploadimage(req.file);
             
              
               recentmsg.image=result.secure_url;
               recentmsg.imageid=result.public_id;
                   }
                   else{
                    const result = await uploadraw(req.file);
                   
                   
                    recentmsg.audio=result.secure_url;
                    recentmsg.audioid=result.public_id;
                   }
            }
            recentmsg.message=req.body.text;
            recentmsg.save();

            const receiver = await User.findOne({_id:recid});
            if(receiver && receiver.pushtoken)
            {
              
                send(receiver.pushtoken,"New message","You have a new message from ",data.user.name);
            }
    
        return res.status(200).send(recentmsg);
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).send("fail");
    }
   

}

export const loadchats = async (req,res) => {
    try{
    const recid = req.query.recid;
    const page = req.query.page;
    const reqUser= req.userId;
    
    const recentmsg = await Messages.find({senderid:{ $in: [reqUser._id,recid]},receiverid:{ $in: [reqUser._id,recid]}})
    .sort({createdDate: -1}).limit(Limits.messageloadlimit*parseInt(page));

    const sortedresult = recentmsg.sort((a, b) => b.createdDate > a.createdDate ? -1: +1);
     
    return res.status(200).send(sortedresult);
    }
    catch(error){
        console.log(error);
        return res.status(400).send({msg:"Could not load chats"})
    }
}


export const seenchats = async (req,res) => {
    try{
    const recid = req.query.recid;
    
    const reqUser= req.userId;
   
    const recentmsg = await Messages.findOne({senderid:{ $in: [recid]},receiverid:{ $in: [reqUser._id]}})
    .sort({createdDate: -1});

    if(recentmsg)
    {recentmsg.seen=true;
    recentmsg.save();}
     
    return res.status(200).send("done");
    }
    catch(error){
        console.log(error);
        return res.status(400).send({msg:"Could not load chats"})
    }
}

export default router;