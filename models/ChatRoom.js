import mongoose from 'mongoose'
const { Schema } = mongoose;


const roomSchema = new Schema({
    members:[{
        type:String,
    }],
    messages:[{
        type:String,
    }],
    block:{
        type:Boolean,
        default:false,
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Chat Room', roomSchema);