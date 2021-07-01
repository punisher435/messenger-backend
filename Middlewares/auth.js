import jwt ,{ decode } from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config('../');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;

const auth = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decodeddata;
        if(token)
        {
            decodeddata=jwt.verify(token,JWT_AUTH_TOKEN);
            req.userId = decodeddata?.id;
        }
        next();
    } catch (error) {
        console.log('NOT AUTHENTICATED',error);
        return res.status(400).send("Not authenticated");
    }
}

export default auth;