const mongoose=require('mongoose')
// const validator=require('validator')
const validator = require('mongoose-validator')
const bcrypt=require('bcryptjs')
const JWT_Token=require('jsonwebtoken')
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    cartItems:[{

        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'Product',
            required:true
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref :"User",
        require:true
    },

    

})



module.exports=mongoose.model("User",userSchema)