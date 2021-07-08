import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import socketio from 'socket.io';
import { ExpressPeerServer } from "peer";
import http from 'http';

import AuthRoutes from "./routes/auth.js";
import MessageRoutes from './routes/message.js';
import User from './routes/user.js';
import {upload} from './Middlewares/multer.js';

dotenv.config()

//App config
const app = express();
const port = process.env.PORT || 8001

const server = http.createServer(app);
const io = socketio(server).sockets;

const servernew = http.createServer(app);

const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  generateClientId: customGenerationFunction,
});

app.use("/mypeer", peerServer);



io.on('connection', function(socket) {
 
  console.log('Client connected.');

  // Disconnect listener
  socket.on('disconnect', function() {
      console.log('Client disconnected.');
  });
  socket.on('join-room',({userId,roomId}) => {
    console.log("join room")
    socket.join(roomId);
    console.log("joined room")

    socket.in(roomId).emit('user-connected',userId);
   
    
    
  })

 
});




//peer


/* app.use("/mypeer",peerServer); */


//Middlewares
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
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





cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, //ENTER YOUR CLOUDINARY NAME
    api_key: `${process.env.CLOUDINARY_API_KEY}`, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
    api_secret: `${process.env.CLOUDINARY_API_KEY_SECRET}` // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
    });

    



//API Endpoints
app.get('/',(req,res) => res.status(200).send(`hello`))

app.use('/auth',AuthRoutes);
app.use('/messages',MessageRoutes);
app.use('/user',User);

app.post(`/${process.env.IMAGE_UPLOAD_URL}`, upload.single("image"), (req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if (err) {
        return res.status(200).send(err);
      }
      req.body.image = result.secure_url;
      // add image's public_id to image object
      req.body.imageId = result.public_id;
  
      console.log(req.body);
      return res.status(200).send(req.body);
    });
  });






//Listener
server.listen(port,() => {console.log(`listening on localhost ${port}`)});









