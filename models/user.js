import mongoose from 'mongoose'
const { Schema } = mongoose;


const userSchema = new Schema({
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    country_code:{
        type:String,
        required:true,
        default: "+91",
    },
    name: {
        type: String,
    },
    status: {
        type: String,
        default: "Hey there!"
    },
    contacts:[{
        type: String,
    }],
    img:
    {
        data: Buffer,
        contentType: String
    },
    profile:{
        type:Boolean,
        default:false
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);