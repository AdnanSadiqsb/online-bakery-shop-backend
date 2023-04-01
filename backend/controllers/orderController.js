const Product= require('../models/productModel')
const catchAsyncError = require('../middleware/catchAsyncError')
const Order = require('../models/orderModel')
const ErrorHandler = require('../utils/errorHandler')
// create new order
exports.newOrder= catchAsyncError(
    async(req,res,next)=>{
        

        const {shippingInfo, orderItems,paymentInfo,itemsPrice, taxPrice,shippingPrice, totalPrice }=req.body

        const order= await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt:Date.now(),
            user:req.user._id
        })

        res.status(200).json({
            success:true,
            order
        })
    }
    
)


//get single order details
exports.getSingleOrder=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id

        const order= await Order.findById(req.params.id).populate("user", "name email")
        if(!order){
            return next(new ErrorHandler("Order not found",404))

        }
        res.status(200).json(
            {
              success:true,
              order  
            }
        )
    }
)

//get login user orders
exports.getLogedUserOrders=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id
        
        const order= await Order.find({user:req.user._id})

        res.status(200).json(
            {
              success:true,
              order  
            }
        )
    }
)

// get all orders --Admin
exports.getAllOrders=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id
        
        const orders= await Order.find().populate("user", "name email")
        let deliverdOrders=0
        let totalAmount=0
        let deliverdOrdersAmount=0
        orders.forEach(order=>{
            totalAmount+=order.totalPrice
            if(order.orderStatus==='Delivered')
            {
                deliverdOrders +=1
                deliverdOrdersAmount=order.totalPrice

            }
        })

        res.status(200).json(
            {
              success:true,
              totalAmount,
              deliverdOrders,
              ordersUnderProcess:orders.length-deliverdOrders,
              deliverdOrdersAmount,
              undeProcessOrderAmount:totalAmount-deliverdOrdersAmount,
              orders
            }
        )
    }
)

// update Order Status --Admin
exports.updateOrderStatus=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id
        
        const order= await Order.findById(req.params.id)
        console.log(order)
        if(!order){
            return next(new ErrorHandler("Order not found",404))


        }
        if(order.orderStatus==='Delivered')
        {
            return next(new ErrorHandler("you have already delivered this order",404))

        }

        order.orderItems.forEach (async order=>{
            await updateStock(order.product,order.quantity)
        });
        order.orderStatus=req.body.status;
        if(req.body.status==="Delivered")
        {

            Order.deliverdAt=Date.now()
        }
        await order.save({validateBeforeSave:false})
        res.status(200).json(
            {
              success:true,

            }
        )
    }
)

async function updateStock(id,quantity){
    const product = await Product.findById(id)
    console.log(product)
    product.stock -= quantity
    await product.save({validateBeforeSave:false})
}


// delete orders --Admin
exports.deleteOrder=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id
        
        const order= await Order.findById(req.params.id)
        if(!order){
            return next(new ErrorHandler("Order not found",404))

        }
        await order.remove()

        res.status(200).json(
            {
              success:true,
            }
        )
    }
)

