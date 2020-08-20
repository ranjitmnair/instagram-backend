const router=require('express').Router();
const Post=require('../models/Post');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const verifyToken=require('../middleware/verifyToken');
const {postValidation}=require('../validation');

router.get('/getposts',verifyToken,async(req,res)=>{
    
    try {
        const posts=await Post
        .find()
        .populate("postedBy","_id name");

        return res.status(200).json({posts});
    } catch (error) {
        return res.status(400).json({error})
    }
})



router.post('/createpost',verifyToken,async(req,res)=>{
    // validation
    const {error}=postValidation(req.body);
    if(error)return res.status(400).json(error.details[0].message);

    req.user.password=null;
    const post=new Post({
        title:req.body.title,
        body:req.body.body,
        postedBy:req.user
    });
    try{
        const savedPost= await post.save();
        return res.status(200).json(post);
    }catch(err){
        return res.status(400).json({err});
    }

})

router.get('/myposts',verifyToken,async(req,res)=>{
    try {
        const posts=await Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name");
         return res.status(200).json({posts});
    } catch (error) {
        return res.status(401).send({error});
    }
})


module.exports=router;