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
        
        const order= await Order.find({user:req.user._id}).sort({createdAt: 'desc' })

        res.status(200).json(
            {
              success:true,
              order  
            }
        )
    }
)


//get all orders of users
exports.getAllOrdersOfUsers=catchAsyncError(
    async(req,res,next)=>{
        const order= await Order.find({user:req.params.id}).sort({createdAt: 'desc' })
        res.status(200).json(
            {
              success:true,
              order  
            }
        )
    }
)

// get all orders --Admin
exports.getAllOrders = catchAsyncError(async(req, res, next) => {
    let startDate;
    let endDate;
  
    //check if date range is specified in request
    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else {
        //set default date range to all orders
        startDate = new Date(0); //start from the beginning of time
        endDate = new Date();
        endDate.setHours(23,59,59,999); //end at the last minute of the current day
      }
  
    //determine the start and end date based on query parameter
    if (req.query.range === 'lastWeek') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (req.query.range === 'lastMonth') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (req.query.range === 'lastYear') {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (req.query.range === 'today') {
      startDate = new Date();
      endDate = new Date();
      startDate.setHours(0,0,0,0);
      endDate.setHours(23,59,59,999);
    }
  
    //find all orders within specified date range and populate user information
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate("user", "name email").sort({createdAt: 'desc'});
  
    //calculate statistics for orders within date range
    let deliveredOrders = 0;
    let totalAmount = 0;
    let deliveredOrdersAmount = 0;
  
    orders.forEach(order => {
      totalAmount += order.totalPrice;
      if (order.orderStatus === 'delivered') {
        deliveredOrders += 1;
        deliveredOrdersAmount += order.totalPrice;
      }
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      deliveredOrders,
      ordersUnderProcess: orders.length - deliveredOrders,
      deliveredOrdersAmount,
      undeProcessOrderAmount: totalAmount - deliveredOrdersAmount,
      orders
    });
  });
  

// update Order Status --Admin
exports.updateOrderStatus=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id
        
        const order= await Order.findById(req.params.id)
   
        if(!order){
            return next(new ErrorHandler("Order not found",404))


        }
        if(order.orderStatus==='delivered')
        {
            return next(new ErrorHandler("you have already delivered this order",404))

        }

        order.orderItems.forEach (async order=>{
            await updateStock(order.product,order.quantity)
        });
        order.orderStatus=req.body.status;
        if(req.body.status==="delivered")
        {

            order.deliverdAt=Date.now()
            order.paymentInfo.status='Paid'
           
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
    try{

        const product = await Product.findById(id)
        product.stock -= quantity
        await product.save({validateBeforeSave:false})
    }catch{

    }
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


//get orders summary --Admin
exports.getOrdersSummary=catchAsyncError(
    async(req,res,next)=>{
        //populate take the id of user in order table ang get name and email according to id
        
      
        const processingOrdersCount = await Order.countDocuments({ orderStatus: 'processing' });
        const readyToShipOrdersCount = await Order.countDocuments({ orderStatus: 'readytoship' });
        const ontheWay = await Order.countDocuments({ orderStatus: 'ontheway' });
        const deliveredOrdersCount = await Order.countDocuments({ orderStatus: 'delivered' });
        const summary=[processingOrdersCount, readyToShipOrdersCount, ontheWay, deliveredOrdersCount]
        res.status(200).json(
            {
              success:true,
              summary
            }
        )
    }
)
