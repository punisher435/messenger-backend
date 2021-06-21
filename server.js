import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config()

//App config
const app = express();
const port = process.env.PORT || 8001

//Middlewares

app.use(cors())
//DB Config

if(process.env.MONGO_DB_URL)
{
    const connectdb = async () => {
        await mongoose.connect(`${process.env.MONGO_DB_URL}`,
        {useUnifiedTopology: true,useCreateIndex:true}).
        then(() => console.log('Connected')).
        catch(err => console.log('Caught', err.stack));
        
    }
    
    connectdb();
  
}

    



//API Endpoints
app.get("/",(req,res) => res.status(200).send(`hello`))


//Listener
app.listen(port,() => {console.log(`listening on localhost ${port}`)})