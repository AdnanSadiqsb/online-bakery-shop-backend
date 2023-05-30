const mongoose=require('mongoose')
// const validator=require('validator')
const validator = require('mongoose-validator')
const bcrypt=require('bcryptjs')
const JWT_Token=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter Name"],
        maxLength:[30, "name should not exceed 30 character"],
        minLength:[4,"name not be less then 4 characters"]

    },
    email:{
        type:String,
        required:[true,"Please enter Email Address"],
        unique:true,
        validate: [
            validator({
              validator: 'isEmail',
              message: 'Oops..please enter valid email'
            })
          ],
    


    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minLength:[4,"The Length of password not be less then 8 characters"],
        select:false

    },
    avatar:{
        public_id:{
            type:String,
            required:false
        },
        url:{
            type:String,
            required:true
        }
        

    },
    role:{
        type:String,
        default:"user"

    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    
   
    resetPasswordToken:String,
    resetPasswordExpire:Date
})
userSchema.pre("save",async function(next){

    //this condition is used that the password only convert into hash if it is modified
    if(!this.isModified("password"))
    {
        next()
    }
    this.password=await bcrypt.hash(this.password,10)


})

// JWT token
userSchema.methods.getJWTToken= function(){
    return JWT_Token.sign({id:this._id},process.env.JWT_SECRETE,{
        expiresIn:process.env.JWT_EXPIRE
    })
}


//genrating password reset token
userSchema.methods.sethlo=function()
{
    console.log("hlo word")
}
userSchema.methods.getResetPassToken = function()
{
    // 

    const resetToken=crypto.randomBytes(20).toString("hex")
    // hashing and adding reset paasword to userSchema
    const tokenCrpto=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordToken=tokenCrpto
    this.resetPasswordExpire=Date.now()+15*60*1000
    return resetToken;
}

// comapare password
userSchema.methods.comparePasssword=async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword,this.password)
}


module.exports=mongoose.model("User",userSchema)