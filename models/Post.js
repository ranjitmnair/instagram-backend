const mongoose=require('mongoose');
const User=require('./User');
const{ObjectId}=mongoose.Schema.Types;
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"None"
    },
    likes:[{type:ObjectId,ref:"User"}],
    likeCount:{
        type:Number,
        default:0
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
},
{timestamps:true}
)

module.exports=mongoose.model('Post',postSchema);