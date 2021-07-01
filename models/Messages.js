import mongoose from 'mongoose'
const { Schema } = mongoose;


const messageSchema = new Schema({
    roomid:{
        type:String,
        required:true,
    },
    senderid:{
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
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Message', messageSchema);