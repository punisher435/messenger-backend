import express from 'express';
import {sendotp,verifysignup,verifysignin,verifyjwt} from '../controllers/auth.js';
const router = express.Router();

router.post("/otp/send",sendotp);
router.post("/otp/verify-and-signup",verifysignup);
router.post("/otp/verify-and-signin",verifysignin);
router.get("/jwt/verify",verifyjwt);


export default router;