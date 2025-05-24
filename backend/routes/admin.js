const { Router } = require("express");
const { adminModel, courseModel } = require("../database/db");
const adminRouter = Router();
const JWT_SECRET = process.env.ADMINJWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: adminMiddleware } = require("../middleware/adminMiddeware");

adminRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    res.json(
      {
        message: "Please provide all the fields",
      },
      400
    );
    return;
  }
  const hasedPassword = await bcrypt.hash(password, 5);
  try {
    await adminModel.create({
      email: email,
      password: hasedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.json(
      {
        message: "Admin Signup successful",
      },
      201
    );
    return;
  } catch (error) {
    res.json(
      {
        message: "Admin Signup failed",
        error,
      },
      400
    );
    return;
  }
});

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  const admin = await adminModel.findOne({ email: email });
  if (!admin) {
    res.json(
      {
        message: "Admin not found",
      },
      204
    );
    return;
  }
  const comparePassword = await bcrypt.compare(password, admin.password);
  if (!comparePassword) {
    return res
      .status(401)
      .json({ message: "Signin failed, Invalid Credentials" });
  }
  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  console.log("Signin successful", email);
  // res.header("token", token);
  return res.status(200).json({ message: "Signin successful" });
});

adminRouter.use(adminMiddleware);

adminRouter.post("/course", async function (req, res) {
  const adminId = req.adminId;
  const { title, description, imageUrl, price } = req.body;

  if (!title || !description || !imageUrl || !price) {
    return res.status(400).json({ message: "Please provide all the fields" });
  }

  const courseExists = await courseModel.findOne({ title });
  if (courseExists) {
    return res.status(400).json({ message: "Course already exists" });
  }

  const course = await courseModel.create({
    title,
    description,
    image: imageUrl,
    price,
    creatorId: adminId,
  });

  return res.status(201).json({
    message: "Course created",
    courseId: course._id,
  });
});

adminRouter.put("/course", async function (req, res) {
  const { courseId, title, description, price, image, creatorId } = req.body;
  const adminId = req.adminId;
  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title,
      description,
      price,
      image,
    }
  );
  res.json({
    message: "Course updated successfully",
    courseId: course._id,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "Course updated",
    courses,
  });
});

adminRouter.delete("/course", async function (req, res) {
  const { courseId } = req;

  const course = await courseModel.deleteOne({
    _id: courseId,
  });

  res.json({
    message: "Course deleted successfully",
    courseId: course._id,
  });
  return;
});

module.exports = {
  adminRouter: adminRouter,
};
