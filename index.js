const express=require('express');
const mongoose = require('mongoose');
const app=express();
require('dotenv').config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false},()=>{
    console.log("database connected");
})


const authRoute=require('./routes/auth');
const postsRoute=require('./routes/posts');

app.use('/api/user',authRoute);
app.use('/api/user',postsRoute);





app.listen(3000,()=>console.log('Server Running'));