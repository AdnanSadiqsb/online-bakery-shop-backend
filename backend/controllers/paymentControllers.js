const catchAsyncError = require('../middleware/catchAsyncError');

const stripe=require('stripe')(process.env.STRIPE_SECRETE_KEY)

exports.processPayment=catchAsyncError(
    async(req,res)=>{
    
        const myPayment= await stripe.paymentIntents.create({
            amount:req.body.amount,
            currency:'inr',
            metadata:{
                company:"ecommerce"
            }
        })
        res.status(200).json({succes:true,client_secret:myPayment.client_secret})
    });

    exports.sendStripeApiKey=catchAsyncError(
        async(req,res)=>{

            res.status(200).json({succes:true,stripeApiKey:process.env.STRIPE_API_KEY})
        });
