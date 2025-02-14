const express = require("express");
const { Router } = require("express");
const { userModel, purchaseModel } = require("../database/db");
const bcrypt = require("bcrypt");
const userRouter = Router();
const JWT_SECRET = process.env.USERJWT_SECRET;
const jwt = require("jsonwebtoken");
const { default: userMiddlware } = require("../middleware/userMiddleware");


userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hasedPassword = await bcrypt.hash(password, 5);
  try {
    await userModel.create({
      email: email,
      password: hasedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.json({
      message: "Signup successful",
    });
    console.log("Signup successful", email);
  } catch (err) {
    res.json({
      message: "Signup failed",
      error: err
    });
  }
});

userRouter.post("/signin", async(req, res) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email: email });
  console.log(user);
  if (!user) {
    res.json({
      message: "User not found",
    });
    return;
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if(comparePassword){
    const token = jwt.sign({
      id:user._id
    },JWT_SECRET);
    res.header("token",token);
    res.json({
      message: "Signin successful",
      token: token
    });
    console.log("Signin successful", email);
  }else{
    res.json({
      message: "Signin failed, Invalid Credentials",
    });
  }
});

userRouter.get("/purchases",userMiddlware, async(req, res) => {
  const courses = await purchaseModel.find({ userId: req.userId });

  res.json({
    message: "Courses purchased",
    courses,
  });
});

module.exports = {
  userRouter: userRouter,
};
