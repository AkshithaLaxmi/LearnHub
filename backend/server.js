const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const { courseRouter } = require('./routes/course');
const { userRouter } = require('./routes/user');
const { adminRouter } = require('./routes/admin');
const Connection = require('./config');
const app = express();

Connection();

app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})