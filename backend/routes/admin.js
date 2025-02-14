const { Router } = require('express');
const { adminModel } = require('../database/db');
const adminRouter = Router();

adminRouter.post('/signup', function (req, res){

});

adminRouter.post('/signin', function (req, res){

});

// adminRouter.use(adminMiddleware);

adminRouter.post('/course',function(req,res){

});
adminRouter.put('/course',function(req,res){

});
adminRouter.get('/course/bulk',function(req,res){

});
adminRouter.delete('/course',function(req,res){

});

module.exports = {
    adminRouter: adminRouter
}