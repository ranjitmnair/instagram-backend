const mongoose=require('mongoose');
const { number } = require('joi');
const{ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        min:2,
        required:true
    },
    email:{
        type:String,
        required:true,
        min:10
    },
    password:{
        type:String,
        required:true,
        min:7
    },
    followers:[{type:ObjectId,ref:"User"}],
    followerCount:Number,
    following:[{type:ObjectId,ref:"User"}],
    followingCount:Number
})

module.exports=mongoose.model('User',userSchema);