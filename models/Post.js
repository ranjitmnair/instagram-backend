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
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
},
{timestamps:true}
)

module.exports=mongoose.model('Post',postSchema);