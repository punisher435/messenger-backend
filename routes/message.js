import express from 'express';


import {addroom,getroom,sendmessage } from '../controllers/messages.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();

router.post("/add-contact",auth,addroom);
router.get("/get-contact",auth,getroom);
router.post("/send",auth,sendmessage);



export default router;