const mongoose =require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"pleade Enter Product name"],
        trim:true

    },
    description:{
        type:String,
        required:[true,"please enter description"]
    },
    shortDescription:{
        type:String,
        required:[true,"please enter short discription"]
    },
    price:{
        type:Number,
        required:[true,"please enter Product PRice"],
        maxLength:[8,"price cannot exceed 8 numbers"],
    },
    total_rating:{
        type:Number,
        default:0

    },
    images:[
        {

            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }

    ],
    category:{
        type:String,
        required:[true,"please specify category"],
    },
    stock:{
        type:Number,
        required:[true,"enter stock detail"],
        maxLength:[4,"stock cannot exceed 4 charecters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref :"User",
                require:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
            cratedAt:{
                type:Date,
                default:Date.now
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref :"User",
        require:true
    },
    cratedAt:{
        type:Date,
        default:Date.now
    }

})


module.exports=mongoose.model("product",productSchema)