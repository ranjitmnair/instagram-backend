const router=require('express').Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const verifyToken=require('../middleware/verifyToken');

router.get('/',verifyToken,(req,res)=>{
    res.status(200).json({message:"hello"});
})

module.exports=router;