const { Router } = require("express");
const { default: userMiddlware } = require("../middleware/userMiddleware");
const { purchaseModel, courseModel } = require("../database/db");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddlware,async(req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  const purchase = await purchaseModel.create({ userId, courseId });
  res.json({
    message: "Course purchased",
    purchase: purchase._id,
  });
});

courseRouter.get("/preview", async(req, res) => {
  const courses = await courseModel.find({});
  res.json({
    message:"Courses",
    courses
  });
});

module.exports = {
  courseRouter: courseRouter
};
