import crypto from "crypto";
import twilio from "twilio";
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Block from "../models/block.js";

const router = express.Router();

dotenv.config('../');

const smsKey = process.env.SMS_SECRET_KEY;
const twilioNum = process.env.TWILIO_TRIAL_NO;
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);


export const verifyjwt =async (req,res) => {

	const token = req.headers.authorization.split(" ")[1];
	
	try{
		const decoded=jwt.verify(token,JWT_AUTH_TOKEN);
		const existingUser = await User.findOne({phone:decoded.user.phone});
			if(existingUser){
				return res.status(200).send(existingUser);
			}
			return res.status(400).send("Invalid token");
	}catch (error)
	{
		console.log(" jwt fail")
		return res.status(400).send("Invalid token");
	}
	
}

export const sendotp = (req,res) => {
	console.log("all good");
	console.log(req.body);
    
    const phone = req.body.phone;
	const country_code = req.body.country_code;
	if(phone.length!=10)
	{
		res.status(400).send({ phone});  
	}
	const otp = 123456;
    const ttl = 5 * 60 * 1000; //5 min
	const expires = Date.now() + ttl;
	const data = `${phone}.${otp}.${expires}`;

    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	const fullHash = `${hash}.${expires}`;


    client.messages
		.create({
			body: `Your one time login password for ${process.env.NAME} is ${otp}`,
			from: twilioNum,
			to: country_code+phone
		})
		.then((messages) => console.log(messages))
		.catch((err) => console.error(err));
		console.log(otp);


    res.status(200).send({ phone, hash: fullHash ,otp:otp,country_code:country_code,retry:5});  

}


export const verifysignup = async (req,res) => {
	const phone = req.body.phone;
	const hash = req.body.hash;
	const otp = req.body.otp;
	const country_code = req.body.country_code;
	console.log("signup")

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
			const result = await User.create({phone,country_code,name:phone});
			const newblock = await Block.create({phone,country_code});
			const token=jwt.sign({user:result},JWT_AUTH_TOKEN,{expiresIn:"48h"});
			return res.status(201).send({user:result,token:token});
		}catch (error){
			return res.status(400).send(error);
		}

	}else {
		console.log('not authenticated');
		return res.status(400).send(JSON.stringify( {verification: false, msg: 'Incorrect OTP' }));
	}
}


export const verifysignin = async (req,res) => {
	const phone = req.body.phone;
	const country_code = req.body.country_code;
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
			
			if(!existingUser){
				return res.status(400).send({ verification: true, msg: 'User does not exists'});
			}
			const existingBlock = await Block.findOne({phone});
			if(existingBlock.blocked==true)
			{
				return res.status(400).send({ verification: false, msg: 'Your account is blocked due to too many incorrect otp attempts. Kindly contact us on our customer care'});
			}
			existingBlock.attempts=5;
			existingBlock.save();
			const token=jwt.sign({user:existingUser},JWT_AUTH_TOKEN,{expiresIn:"48h"});

			return res.status(200).send({user:existingUser,token:token});
		}catch (error){
			return res.status(400).send(error);
		}
		 
	}else {
		console.log('not authenticated');
		try{
			const existingBlock = await Block.findOne({phone});
			if(existingBlock){
				existingBlock.attempts=existingBlock.attempts-1;
				if(existingBlock.attempts<=0)
				{
					existingBlock.blocked=true;
				}
				existingBlock.save();
			}

		}catch (error){

		}
		return res.status(400).send({ verification: false, msg: 'Incorrect OTP',retry:req.body.retry-1 });
	}
}


export default router;
