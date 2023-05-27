const express= require('express')
const { newOrder, getSingleOrder, getLogedUserOrders, getAllOrders, updateOrderStatus, deleteOrder,getAllOrdersOfUsers , getOrdersSummary} = require('../controllers/orderController')
const { isAuthenciatedUser, authorizeRole } = require('../middleware/auth')
const router= express.Router()

router.route('/order/new').post(isAuthenciatedUser, newOrder)
router.route('/admin/order/:id').get(isAuthenciatedUser, getSingleOrder)
router.route('/orders/me').get(isAuthenciatedUser,getLogedUserOrders)
router.route('/admin/orders').get(isAuthenciatedUser, authorizeRole('admin'), getAllOrders)
router.route('/admin/order/:id').put(isAuthenciatedUser, authorizeRole('admin'), updateOrderStatus)
router.route('/admin/order/:id').delete(isAuthenciatedUser, authorizeRole('admin'), deleteOrder)
router.route('/admin/orders/:id').get(isAuthenciatedUser, authorizeRole('admin'), getAllOrdersOfUsers)

router.route('/admin_orders_summary').get(isAuthenciatedUser,authorizeRole('admin'), getOrdersSummary)
module.exports=router