import mongoose from 'mongoose'
const { Schema } = mongoose;


const blockSchema = new Schema({
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
    blocked:{
    type:Boolean,
    default:false,
    },
    attempts:{
        type:Number,
        default:5,
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Block', blockSchema);