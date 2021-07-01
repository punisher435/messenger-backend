import crypto from "crypto";
import twilio from "twilio";
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import ChatRoom from "../models/ChatRoom.js";
import axios from 'axios'

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

        if(req.userId.contacts.includes(existingUser._id))
        {
            return res.status(400).send({ msg:'Already added'});
        }
        const reqUser = await User.findOne({_id:req.userId._id});

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

export const sendmessage = async (req,res) => {
    console.log(req.body);

}

export default router;