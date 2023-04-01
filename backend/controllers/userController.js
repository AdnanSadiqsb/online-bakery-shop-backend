const User= require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError=require('../middleware/catchAsyncError');
const sendToken = require('../utils/JWTToken');
const sendEmail = require('../utils/sendEmail')
const crypto= require('crypto')
const cloudnary=require('cloudinary')
//regester user
exports.registerUser=catchAsyncError(

    async(req,res,next)=>{
        console.log("register apu called")
        // upload user image on server
        console.log(req.body.email)
        const myCloud=await cloudnary.v2.uploader.upload(req.body.avatar,{
            folder:"avtars",
            width:150,
            crop:"scale"
        })
        console.log(req.body.email)
        const {name, email,password}=req.body
        const oldUser= await User.find({"email":email})
        if(oldUser.length!==0)
        {   
            console.log("user Exist")
            return(res.status(400).json({success:false,message:"user with this email already exist"}))
        }
        const user= await User.create({

            name,email,password,
            avatar:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url
                
            }
        });
        //  fuction that written in utility class
         sendToken(user,200,res)
    })


///login user

exports.loginUser=catchAsyncError(
    async (req,res,next)=>{
        const {email,password}=req.body
        //cheking if user have given password and emial both
        if(!email ||!password){
            return next (new ErrorHandler("please enter Email and Password"),400)
        }
        // weh write selet("+password") beacuse we set select false in when definig the sechema of user
        const user=await User.findOne({email}).select("+password")
        if(!user){
            return next (new ErrorHandler("Invalid Email or Password"),401)
        }
        const isPAsswordMatched=await user.comparePasssword(password)

        if(!isPAsswordMatched){
            return next (new ErrorHandler("Invalid Email or Password"),401)
        }
        //fuction that written in utility class
        sendToken(user,200,res)


    }
)

exports.logOut= catchAsyncError(
    async (req,res,next)=>{

        res.cookie('token',null,{
            expires:new Date(Date.now()),
            httpOnly:true
        })
        res.status(200).json({
            success:true,
            message:"logged Out"
        })
    }
)

//froget password

exports.forgotPassword=catchAsyncError(
    async (req,res,next)=>{
        
        const user= await User.findOne({email:req.body.email})
        if(!user)
        {
            return next(new ErrorHandler("User not found",404))
  

        }
        
          //get reset password token
    
        const resetToken=user.getResetPassToken()
    
        await user.save({vaildateBeforeSave:false}) 
        console.log(user)
        const resetPassURL= `${process.env.FRONTEND_URL}password/reset/${resetToken}`

        const message =`your rest password token : - \n\n ${resetPassURL} \n\n if you have not requsted this email then please ignore it`

        try{
            
            await sendEmail({
                    email:user.email,
                    subject:'Ecommerce password recovery',
                    message:message
            });
            res.status(200).json({
                success:true,
                message:`email send to ${user.email}`
            })

        }catch(error){
            user.resetPasswordToken=undefined
            user.resetPasswordExpire=undefined
            await user.save({vaildateBeforeSave:false})
            return next(new ErrorHandler(error.message,500))
        }

    }
)

//reset password
exports.resetPassowrd=catchAsyncError(
    async(req,res,next)=>{
        //creating token hash
        console.log(req.params.token)
        let  resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        console.log(resetPasswordToken)
        resetPasswordToken='89546444f71dbca53d9f57a1a3e2bc4525916850feb7fd5aad3e2290765b4156'
        const user=await User.findOne({resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
        })
        console.log(user  +"user hi")
        if(req.body.password !== req.body.confirmPassword)
        {
            return next(new ErrorHandler("Password does not match",400))

        }
        if(!user)
        {
            return next(new ErrorHandler("Reset PAssword Token is invalid or Expired ",400))

        }

       
        user.password=req.body.password
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save()
        sendToken(user,200,res)
    }


 
)

// get user details
exports.getUserDetail=catchAsyncError(

    async(req,res,next)=>{
        const user= await User.findById(req.user._id)
        
            res.status(200).json({
                success:true,
                user
            })
    
    }
)
// update password
exports.updatePassword=catchAsyncError(

    async(req,res,next)=>{
        const user= await User.findById(req.user._id).select('+password')
        const isPAsswordMatched=await user.comparePasssword(req.body.oldPassword)

        if(!isPAsswordMatched){
            return next (new ErrorHandler("Old password is incorrect"),400)
        }
        if(req.body.newPassword !== req.body.confirmPassword)
        {
            return next (new ErrorHandler("password does not match"),400)

        }
        user.password=req.body.newPassword
        await user.save()
            res.status(200).json({
                success:true,
                user
            })
    
    }
)
// update profiel
exports.updateProfile=catchAsyncError(

    async(req,res,next)=>{
        const newUserData={
            name:req.body.name,
            email:req.body.email
        }
    if(req.body.avatar !=="")
    {
        const user= await User.findById(req.user.id);
        const imageId= user.avatar.public_id;
        await cloudnary.v2.uploader.destroy(imageId)
        const myCloud=await cloudnary.v2.uploader.upload(req.body.avatar,{
            folder:"avtars",
            width:150,
            crop:"scale"
        })
        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    }

    const user=await User.findByIdAndUpdate(req.user._id,newUserData,{
        new:true,
        runValidators:true

    })
    res.status(200).json({
        success:true,
        user
    })
    
})


// get all user  (admin)

exports.getAllUsers=catchAsyncError(
    async(req,res,next)=>{
        const users= await User.find()
        res.status(200).json({
            success:true,
            users
        })
    }
)

// get single  user detail (admin)

exports.getSingleUser=catchAsyncError(
    async(req,res,next)=>{
        const user= await User.findById(req.params.id)
        if(!user)
        {
            return next(new ErrorHandler(`user not exist with id: ${user.params.id}`,400))
        }
        res.status(200).json({
            success:true,
            user
        })
    }
)


// update user role  (admin)
exports.updateUserRole=catchAsyncError(

    async(req,res,next)=>{
        const newUserData={
            role:req.body.role
        }
    // we will add cloudnary lattter
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true

    })
    res.status(200).json({
        success:true,
        user
    })
    
})

// delete user (admin)
exports.deleteUser=catchAsyncError(

    async(req,res,next)=>{
        const user= await User.findOne({_id:req.params.id})
        
        if(!user)
        {
            return next(new ErrorHandler(`user not exist with id: ${user.params.id}`,400))
        }
        // we will remove cloudnay latter
        await user.remove()
        res.status(200).json({
         success:true,
         message:"success fuly deleted"
    })
    
})


