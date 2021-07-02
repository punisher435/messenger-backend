import mongoose from 'mongoose'
const { Schema } = mongoose;


const messageSchema = new Schema({
   
    senderid:{
        type:String,
        required:true,
    },
    receiverid:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    imageid:{
        type:String,
    },
    audio:{
        type:String,
    },
    audioid:{
        type:String,
    },
    message:{
        type:String,   
    },
    seen:{
        type:Boolean,
        default:false,
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Message', messageSchema);