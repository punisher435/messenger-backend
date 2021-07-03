import express from 'express';


import {addroom,getroom,sendmessage,getrecent,loadchats,seenchats } from '../controllers/messages.js';
import auth from '../Middlewares/auth.js';
import {upload} from '../Middlewares/multer.js';

const router = express.Router();

router.post("/add-contact",auth,addroom);
router.get("/get-contact",auth,getroom);
router.get("/load-chats",auth,loadchats);
router.get("/seen",auth,seenchats);
router.get("/get-recent-chats",auth,getrecent);
router.post("/send-message",upload.single("image"),sendmessage);



export default router;