import crypto from "crypto";
import twilio from "twilio";
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const router = express.Router();

dotenv.config('../');

const smsKey = process.env.SMS_SECRET_KEY;
const twilioNum = process.env.TWILIO_TRIAL_NO;
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendotp = (req,res) => {
    
    const phone = req.body.phone;
	if(phone.length!=10)
	{
		res.status(400).send({ phone});  
	}
	const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 5 * 60 * 1000; //5 min
	const expires = Date.now() + ttl;
	const data = `${phone}.${otp}.${expires}`;

    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	const fullHash = `${hash}.${expires}`;


    /* client.messages
		.create({
			body: `Your one time login password for ${process.env.NAME} is ${otp}`,
			from: twilioNum,
			to: phone
		})
		.then((messages) => console.log(messages))
		.catch((err) => console.error(err)); */


    res.status(200).send({ phone, hash: fullHash ,otp:otp});  

}


export const verifysignup = async (req,res) => {
	const phone = req.body.phone;
	const hash = req.body.hash;
	const otp = req.body.otp;

	let [ hashValue, expires ] = hash.split('.');

	let now = Date.now();
	if (now > parseInt(expires)) {
		return res.status(504).send({ msg: 'Timeout. Please try again' });}
	let data = `${phone}.${otp}.${expires}`;
	let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');

	if (newCalculatedHash === hashValue) {
		console.log('user confirmed');
		
		try{
			const existingUser = await User.findOne({phone});
			if(existingUser){
				return res.status(400).send({ verification: true, msg: 'User already exists'});
			}
			const result = await User.create({phone});
			const token=jwt.sign({phone:result.phone,id:result._id},JWT_AUTH_TOKEN,{expiresIn:"48h"});
			return res.status(201).send({user:result,token:token});
		}catch (error){
			return res.status(400).send(error);
		}

		res.status(200).send({ phone, verification:true,msg:'Verified'});  
	}else {
		console.log('not authenticated');
		return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
	}
}


export default router;