import crypto from "crypto";
import twilio from "twilio";
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import axios from 'axios'

import User from "../models/user.js";
import { uploadimage } from "../Middlewares/cloudinary.js";
import {auth} from "../Middlewares/auth_help.js";



const router = express.Router();

dotenv.config('../');





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


export const editprofile = async (req,res) => {
    const data=await auth(req,res);
    
    
    try{
        const reqUser = await User.findOne({_id:data.user._id});
        
        if(reqUser)
        {
            console.log(req.file);
            
           const result = await uploadimage(req.file);
           console.log(result);
           reqUser.name=req.body.name;
           reqUser.img=result.secure_url;
           reqUser.imgid=result.public_id;
            reqUser.save();
            return res.status(200).send(reqUser);
        }
        return res.status(400).send({msg:'Error'});
    }
    catch(error){
        return res.status(400).send({error});
    }

    return res.status(400).send({ msg:'Could not find any chats'});

}




export default router;