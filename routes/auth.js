import express from 'express';
import {sendotp,verifysignup} from '../controllers/auth.js';
const router = express.Router();

router.post("/otp/send",sendotp);
router.post("/otp/verify-and-signup",verifysignup);


export default router;