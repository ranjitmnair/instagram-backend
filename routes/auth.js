const router=require('express').Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {registerValidation,loginValidation}=require('../validation');

router.post('/register',async(req,res)=>{
    //validation
    const {error}=registerValidation(req.body);
    if(error)return res.status(400).json(error.details[0].message);


    //check if user already exists:
    const emailExist=await User.findOne({email:req.body.email});
    if(emailExist)return res.status(400).json("Email already exists");

    //hashing password

    const salt=await bcrypt.genSalt(7);//salt added
    const hashPassword=await bcrypt.hash(req.body.password,salt);

    // hence create user
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword
    });
    try{
        const savedUser= await user.save();
        return res.send({user:user._id});
    }catch(err){
        return res.status(400).send(err);
    }
});

router.post('/login',async(req,res)=>{

    //checking validation
    const {error}=loginValidation(req.body);
    if(error)return res.status(400).send(error.details[0].message);

    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('User not Found');

    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword)return res.status(400).send('Password wrong');

    const token=jwt.sign({_id:user._id},process.env.SECRET_TOKEN);

    res.header('auth-token',token).json({token});

})

module.exports=router;