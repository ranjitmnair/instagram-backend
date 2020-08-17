const express=require('express');
const mongoose = require('mongoose');
const app=express();
require('dotenv').config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true},()=>{
    console.log("database connected");
})


const authRoute=require('./routes/auth');
app.use('/api/user',authRoute);






app.listen(3000,()=>console.log('Server Running'));