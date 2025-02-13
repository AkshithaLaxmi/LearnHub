const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const { createUserRoutes } = require('./user');
const { createCourseRoutes } = require('./course');

createUserRoutes(app);
createCourseRoutes(app);
// app.post('/user/signup',(req,res)=>{

// })

// app.post('/user/signin',(req,res)=>{

// })

// app.get('/user/purchases',(req,res)=>{
    
// })

// app.post('/course/purchase',(req,res)=>{

// })

// app.get('/course/preview',(req,res)=>{

// })

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})