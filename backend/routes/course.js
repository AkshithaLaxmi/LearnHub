const { Router } = require("express");
const { default: userMiddlware } = require("../middleware/userMiddleware");
const { purchaseModel, courseModel } = require("../database/db");
const { default: adminMiddleware } = require("../middleware/adminMiddeware");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddlware, async(req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  // Check if user already purchased the course
  const existingPurchase = await purchaseModel.findOne({ userId, courseId });
  if (existingPurchase) {
    return res.status(400).json({
      message: "You have already purchased this course"
    });
  }

  await purchaseModel.create({ userId, courseId });
  res.json({
    message: "Course purchased",
  }, 201);
  
  return;
});

courseRouter.get("/purchased", userMiddlware, async(req, res) => {
  const userId = req.userId;
  const purchases = await purchaseModel.find({ userId }).populate("courseId");
  if (!purchases) {
    return res.status(404).json({
      message: "No purchases found"
    });
  }

  res.json({
    message: "Purchased courses",
    purchases
  },200);
});

courseRouter.get("/preview",userMiddlware, async(req, res) => {
  const courses = await courseModel.find({}).sort({ _id: -1 });
  res.json({
    message:"Courses",
    courses
  });
});

courseRouter.get("/launched", adminMiddleware, async(req, res) => {
  const adminId = req.adminId;
  const courses = await courseModel.find({ creatorId: adminId }).sort({ _id: -1 });
  
  if (!courses || courses.length === 0) {
    return res.status(404).json({
      message: "No courses found"
    });
  }

  res.json({
    message: "Launched courses",
    courses
  },200);
});

module.exports = {
  courseRouter: courseRouter
};
