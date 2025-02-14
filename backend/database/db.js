const { Schema, moongoose } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    email:{type:String,required:true,unique:true},
    password:String,
    firstName:String,
    lastName:String,
})

const adminSchema = new Schema({
    email:{type:String,required:true,unique:true},
    password:String,
    firstName:String,
    lastName:String,
})

const courseSchema = new Schema({
    title:{type:String,required:true},
    description:String,
    price:Number,
    image:String,
    creatorId: ObjectId,
})

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
    // purchaseDate: { type: Date, default: Date.now },
})

const userModel = moongoose.model("user",userSchema);
const adminModel = moongoose.model("admin",adminSchema);
const courseModel = moongoose.model("course",courseSchema);
const purchaseModel = moongoose.model("purchase",purchaseSchema);

module.exports = {
    userModel:userModel,
    adminModel:adminModel,
    courseModel:courseModel,
    purchaseModel:purchaseModel
}