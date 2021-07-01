import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/auth.js";
import bodyParser from 'body-parser';
import multer from 'multer';
import cloudinary from 'cloudinary';
dotenv.config()

//App config
const app = express();
const port = process.env.PORT || 8001

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


const storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
    },
    destination:'./uploads',
    });

const imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
    }
    cb(null, true);
    };

const upload = multer({ storage: storage, fileFilter: imageFilter });


cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, //ENTER YOUR CLOUDINARY NAME
    api_key: `${process.env.CLOUDINARY_API_KEY}`, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
    api_secret: `${process.env.CLOUDINARY_API_KEY_SECRET}` // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
    });

    



//API Endpoints
app.get('/',(req,res) => res.status(200).send(`hello`))

app.use('/auth',AuthRoutes);

app.post("/add", upload.single("image"), (req, res) => {
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
app.listen(port,() => {console.log(`listening on localhost ${port}`)})