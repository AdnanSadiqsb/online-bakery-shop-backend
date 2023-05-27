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

        const myCloud=await cloudnary.v2.uploader.upload(req.body.avatar,{
            folder:"avtars",
            width:150,
            crop:"scale"
        })
     
        const {name, email,password}=req.body
        const oldUser= await User.find({"email":email})
        if(oldUser.length!==0)
        {   

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

        const resetPassURL= `${process.env.FRONTEND_URL}password/reset/${resetToken}`

        // const message =`<h1> your rest password token : - \n\n ${resetPassURL} \n\n if you have not requsted this email then please ignore it</h1>`
        const message=`
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
	<!--[if gte mso 9]>
	<xml>
		<o:OfficeDocumentSettings>
		<o:AllowPNG/>
		<o:PixelsPerInch>96</o:PixelsPerInch>
		</o:OfficeDocumentSettings>
	</xml>
	<![endif]-->
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="format-detection" content="date=no" />
	<meta name="format-detection" content="address=no" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
   	<link href="https://fonts.googleapis.com/css?family=Kreon:400,700|Playfair+Display:400,400i,700,700i|Raleway:400,400i,700,700i|Roboto:400,400i,700,700i" rel="stylesheet" />
    <!--<![endif]-->
	<title>Email Template</title>
	<!--[if gte mso 9]>
	<style type="text/css" media="all">
		sup { font-size: 100% !important; }
	</style>
	<![endif]-->
	

	<style type="text/css" media="screen">
		/* Linked Styles */
		body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#1e52bd; -webkit-text-size-adjust:none }
		a { color:#000001; text-decoration:none }
		p { padding:0 !important; margin:0 !important } 
		img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }
		.mcnPreviewText { display: none !important; }
		.text-footer2 a { color: #ffffff; } 
		
		/* Mobile styles */
		@media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {
			.mobile-shell { width: 100% !important; min-width: 100% !important; }
			
			.m-center { text-align: center !important; }
			.m-left { text-align: left !important; margin-right: auto !important; }
			
			.center { margin: 0 auto !important; }
			.content2 { padding: 8px 15px 12px !important; }
			.t-left { float: left !important; margin-right: 30px !important; }
			.t-left-2  { float: left !important; }
			
			.td { width: 100% !important; min-width: 100% !important; }

			.content { padding: 30px 15px !important; }
			.section { padding: 30px 15px 0px !important; }

			.m-br-15 { height: 15px !important; }
			.mpb5 { padding-bottom: 5px !important; }
			.mpb15 { padding-bottom: 15px !important; }
			.mpb20 { padding-bottom: 20px !important; }
			.mpb30 { padding-bottom: 30px !important; }
			.m-padder { padding: 0px 15px !important; }
			.m-padder2 { padding-left: 15px !important; padding-right: 15px !important; }
			.p70 { padding: 30px 0px !important; }
			.pt70 { padding-top: 30px !important; }
			.p0-15 { padding: 0px 15px !important; }
			.p30-15 { padding: 30px 15px !important; }			
			.p30-15-0 { padding: 30px 15px 0px 15px !important; }			
			.p0-15-30 { padding: 0px 15px 30px 15px !important; }			


			.text-footer { text-align: center !important; }

			.m-td,
			.m-hide { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }

			.m-block { display: block !important; }

			.fluid-img img { width: 100% !important; max-width: 100% !important; height: auto !important; }

			.column,
			.column-dir,
			.column-top,
			.column-empty,
			.column-top-30,
			.column-top-60,
			.column-empty2,
			.column-bottom { float: left !important; width: 100% !important; display: block !important; }

			.column-empty { padding-bottom: 15px !important; }
			.column-empty2 { padding-bottom: 30px !important; }

			.content-spacing { width: 15px !important; }
		}
	</style>
</head>
<body class="body"style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#1e52bd; -webkit-text-size-adjust:none;">
	<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#40A944">
		<tr>
			<td align="center" valign="top">
				<!-- Main -->
				<table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
					<tr>
						<td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
							<!-- Header -->
							<table width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
									<td class="p30-15" style="padding: 40px 0px 20px 0px;">
										<table width="100%" border="0" cellspacing="0" cellpadding="0">
								
										</table>
									</td>
								</tr>
								<!-- END Top bar -->
								<!-- Logo -->
								<tr>
									<td bgcolor="#ffffff" class="p30-15 img-center" style="padding: 30px; border-radius: 20px 20px 0px 0px; font-size:0pt; line-height:0pt; text-align:center;"><a href="#" target="_blank"><img src="images/free_logo.jpg" width="146" height="17" border="0" alt="" /></a></td>
								</tr>
								<!-- END Logo -->
								<!-- Nav -->
					
								<!-- END Nav -->
							</table>
							<!-- END Header -->
								
							<!-- Section 1 -->
							<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ebebeb">
					
								<tr>
									<td class="p30-15-0" style="padding: 50px 30px 0px;" bgcolor="#ffffff">
										<table width="100%" border="0" cellspacing="0" cellpadding="0">
											<tr>
												<td class="h5-center"style="color:#a1a1a1; font-family:'Raleway', Arial,sans-serif; font-size:16px; line-height:22px; text-align:left; padding-bottom:5px;">Dear, ${user.name}</td>
											</tr>
									
											<tr>
												<td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; padding-bottom:22px;">
													I hope this email finds you well. We have received your request for a password reset email. As requested, we are sending you the link to reset your password.												
												</td>
											</tr>
											<tr>
												<td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; padding-bottom:22px;">

													To reset your password, please follow the steps below:												</td>
											</tr>
											<tr>
												<td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; padding-bottom:22px;">
													<ol>
														<li>Click on the following button</li>
														<li>On the password reset page, enter your new password in the "New Password" field.</li>
														<li>Confirm your new password in the "Confirm Password" field.</li>
														<li>Click on the "Reset Password" button to save your new password.</li>
													</ol>
											</tr>
											<tr>
												<td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; padding-bottom:22px;">

													Please note that this link will expire in 24 hours for security reasons. If you do not reset your password within this time frame, you will need to request a new password reset email.	</tr>
											<tr>
											<tr>
												<td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; padding-bottom:22px;">

													If you did not request a password reset email, please ignore this message and delete it. Rest assured that your account is still secure.<tr>
												<tr>
													<td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; padding-bottom:22px;">
		
														Thank you for choosing our service.<tr>
												<td align="center">
													<table border="0" cellspacing="0" cellpadding="0">
														<tr>
															<td class="text-button-orange"style="background:#40A944; color:#ffffff; font-family:'Kreon', 'Times New Roman', Georgia, serif; font-size:14px; line-height:18px; text-align:center; padding:10px 30px; border-radius:20px;"><a href=${resetPassURL} target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Reset Now</span></a></td>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
							<!-- END Section 1 -->


							<!-- END Section 8 -->
							
							<!-- Footer -->
							<table width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
									<td class="p30-15-0" bgcolor="#ffffff" style="border-radius: 0px 0px 20px 20px; padding: 70px 30px 0px 30px;">
										<table width="100%" border="0" cellspacing="0" cellpadding="0">
										 	<tr>
												<td class="m-padder2 pb30" align="center"style="padding-bottom:30px;">
													<table class="center" border="0" cellspacing="0" cellpadding="0"style="text-align:center;">
												
													</table>
												</td>
											</tr>
											<tr>
												<td align="center" class="p30-15" style="border-top: 1px solid #ebebeb; padding: 30px;">
													<table class="center" border="0" cellspacing="0" cellpadding="0"style="text-align:center;">
														<tr>
															<th class="column-top" width="180"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
																<table width="100%" border="0" cellspacing="0" cellpadding="0">
																	<tr>
																		<td class="text-footer"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:13px; line-height:22px; text-align:left;">
																			<multiline>
																				<strong>Catalog &amp; Brochures</strong><br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Request</span></a> <br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">View Online</span></a> <br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Buying Guides</span></a>
																			</multiline>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column-empty" width="20"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;"></th>
															<th class="column-top" width="180"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
																<table width="100%" border="0" cellspacing="0" cellpadding="0">
																	<tr>
																		<td class="text-footer"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:13px; line-height:22px; text-align:left;">
																			<multiline>
																				<strong>Need Help</strong><br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">FAQ</span></a><br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Contact Us</span></a><br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Return Policy</span></a><br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Children's Product Registration</span></a>
																			</multiline>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column-empty" width="20"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;"></th>
															<th class="column-top" width="180"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;">
																<table width="100%" border="0" cellspacing="0" cellpadding="0">
																	<tr>
																		<td class="text-footer"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:13px; line-height:22px; text-align:left;">
																			<multiline>
																				<strong>Delivery Information</strong><br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Store Delivery</span></a> <br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Online Delivery</span></a> <br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Picking with Delivery</span></a> <br />
																				<a href="#" target="_blank" class="link-grey"style="color:#5d5c5c; text-decoration:none;"><span class="link-grey"style="color:#5d5c5c; text-decoration:none;">Track an Order</span></a>
																			</multiline>
																		</td>
																	</tr>
																</table>
															</th>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
							<table width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
									<td class="text-footer2 p30-15" style="padding: 30px 15px 50px 15px; color:#a9b6e0; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:22px; text-align:center;"><multiline>Want to change how you receive these emails? <br />You can <a href="#" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">update your preferences</span></a> or <a href="#" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">unsubscribe</span></a> from this list.</multiline></td>
								</tr>
							</table>
							<!-- END Footer -->
						</td>
					</tr>
				</table>
				<!-- END Main -->

			</td>
		</tr>
	</table>
</body>
</html>

        `
        try{
            
            await sendEmail({
                    email:user.email,
                    subject:'Password Reset Email Request',
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
        let  resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user=await User.findOne({resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
        })
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
		// Get the name query parameter from the request header
		const name = req.body.name;

		// Define the filter object based on the name query parameter
		const filter = name ? { name: { $regex: name, $options: "i" } } : {};
        const users= await User.find(filter)
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


