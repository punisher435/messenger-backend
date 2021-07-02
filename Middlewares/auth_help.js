import jwt ,{ decode } from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config('../');

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;

export const auth = async (req,res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        let decodeddata;
        if(token)
        {
            decodeddata=jwt.verify(token,JWT_AUTH_TOKEN);
            req.userId = decodeddata?.user;
           console.log("success")
           return decodeddata;
           
        }
        
    } catch (error) {
        console.log('NOT AUTHENTICATED',error);
        return res.status(400).send("Not authenticated");
    }
}

