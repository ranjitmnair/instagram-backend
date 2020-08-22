const router = require ('express').Router ();
const Post = require ('../models/Post');
const User = require('../models/User');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const verifyToken = require ('../middleware/verifyToken');


router.get('/profile/:id',verifyToken,async(req,res)=>{
    const user=await User.findOne({_id:req.params.id})
    .select("-password -email");
    const posts=await Post.find({postedBy:req.params.id})
    .populate("postedBy","_id name");
    try {
        return res.status(200).json({user,posts});
    } catch (error) {
        return res.status(400).json(error);
    }
    
})



module.exports=router;