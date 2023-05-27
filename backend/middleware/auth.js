const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jswt= require('jsonwebtoken')
const User= require('../models/userModel')
exports.isAuthenciatedUser=catchAsyncError(
    async (req,res,next)=>{
        

            const {token}=req.cookies;
            if(!token){
                return next(new ErrorHandler("Please login to access this",401))
            }
            const decodeData=jswt.verify(token,process.env.JWT_SECRETE);
            
            req.user =await User.findById(decodeData.id)
            console.log(req.user)
            next()
     


    }
)

exports.authorizeRole=(...roles)=>{
    return(req,res,next)=>{

        //the data of user in req is saved when user login  in above function isauthenticateusser
        if(!roles.includes(req.user.role))
        {
            return next( new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`))
        }
        next()
    }
}