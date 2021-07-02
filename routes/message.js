import express from 'express';


import {addroom,getroom,sendmessage,getrecent } from '../controllers/messages.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();

router.post("/add-contact",auth,addroom);
router.get("/get-contact",auth,getroom);
router.get("/get-recent-chats",auth,getrecent);
router.post("/send",auth,sendmessage);



export default router;