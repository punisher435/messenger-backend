import cloudinary from 'cloudinary';
import dotenv from "dotenv";

dotenv.config('../')

cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, //ENTER YOUR CLOUDINARY NAME
    api_key: `${process.env.CLOUDINARY_API_KEY}`, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
    api_secret: `${process.env.CLOUDINARY_API_KEY_SECRET}` // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
    });


export const uploadraw =async (file) => {
    console.log(file);
    return cloudinary.v2.uploader.upload(file.path,{resource_type: "raw",} ,function(err, result) {
      if (err) {
        return err;
      }
      
      
  
      console.log(result);
      return result;
    });
  }