import express from 'express';
import {editprofile,registerpushtoken} from '../controllers/user.js';
import auth from '../Middlewares/auth.js';
import {upload} from '../Middlewares/multer.js';
const router = express.Router();

router.post("/profile",upload.single("image"),editprofile);
router.post("/pushtoken",auth,registerpushtoken);



export default router;