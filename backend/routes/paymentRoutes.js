const express=require('express')
const { processPayment , sendStripeApiKey} = require('../controllers/paymentControllers')
const router = express.Router()
const {isAuthenciatedUser} =require('../middleware/auth')

router.route('/payment/process').post(isAuthenciatedUser, processPayment)
router.route('/stripeapikey').get(isAuthenciatedUser, sendStripeApiKey)

module.exports=router
