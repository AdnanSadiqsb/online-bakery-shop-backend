const mongoose= require('mongoose')

const orderSchema= new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
        province:{
            type:String,
            required:true
        },

    },
    orderItems:[{

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
    paymentInfo:{
        id:{
            type:String
        },
        status:{
            type:String,
            default:"Pending"
        },
        paymentMethod:{
            type:String,
            required:true
        }
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemsPrice:{
        type:Number,
        default:0,
        reuired:true
    },
    taxPrice:{
        type:Number,
        default:0,
        reuired:true
    },
    shippingPrice:{
        type:Number,
        default:0,
        reuired:true
    },
    totalPrice:{
        type:Number,
        default:0,
        reuired:true
    },
    ordernote:{
        type:String,
        default:"Please let us know if you have any questions or concerns regarding your order, and our customer service team will be happy to assist you."
    },
    orderStatus:{
        type:String,
        required:true,
        default:'processing'
    },
    deliverdAt:{
        type:Date
    },
    
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports= mongoose.model('Order', orderSchema)