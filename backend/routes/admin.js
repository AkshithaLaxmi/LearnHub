const { Router } = require('express');
const { adminModel, courseModel } = require('../database/db');
const adminRouter = Router();
const JWT_SECRET = process.env.ADMINJWT_SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { default: adminMiddleware } = require('../middleware/adminMiddeware');

adminRouter.post('/signup', async function (req, res){
    const { email, password, firstName, lastName } = req.body;
    const hasedPassword = await bcrypt.hash(password, 5);
    try {
        await adminModel.create({
            email: email,
            password: hasedPassword,
            firstName: firstName,
            lastName: lastName,
        });
        res.json({
            message: "Admin Signup successful",
        });
    } catch (error) {
        res.json({
            message: "Admin Signup failed",
            error
        })
    }
});

adminRouter.post('/signin', async function(req, res){
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email: email });
    if(!admin){
        res.json({
            message: "Admin not found"
        });
        return;
    }
    const comparePassword = await bcrypt.compare(password, admin.password);
    if(comparePassword){
        const token = jwt.sign({
            id: admin._id
        }, JWT_SECRET);
        res.header("token", token);
        res.json({
            message: "Admin Signin successful",
            token: token
        });
    }else{
        res.json({
            message: "Admin Signin failed, Invalid Credentials"
        });
    }
});

// adminRouter.use(adminMiddleware);

adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;

    const { title, description, imageUrl, price } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
});

adminRouter.put('/course',async function(req,res){
    const { courseId, title, description, price, image,creatorId } = req.body;
    const adminId = req.adminId;
    const course = await courseModel.updateOne({
        _id:courseId,
        creatorId: adminId
    },{
        title, description, price, image
    })
    res.json({
        message: "Course updated successfully",
        courseId: course._id
    })
});
adminRouter.get("/course/bulk", adminMiddleware,async function(req, res) {
    const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
})
adminRouter.delete('/course',function(req,res){

});

module.exports = {
    adminRouter: adminRouter
}