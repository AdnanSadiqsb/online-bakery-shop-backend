const Category= require('../models/categoryModel')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
// create new category
exports.addCategory= catchAsyncError(
    async(req,res,next)=>{
        const category= await Category.create(req.body)
        res.status(200).json({
            success:true,
            category
        })
    }
)

// get all categories
exports.getAllCategories=catchAsyncError(

    async(req,res,next)=>{
        const categories= await Category.find().sort({createdAt: 'desc' })
        
            res.status(200).json({
                success:true,
                categories
            })
    
    }
)