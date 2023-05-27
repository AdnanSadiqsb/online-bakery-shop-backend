const express = require('express')
const { registerUser, loginUser, logOut, forgotPassword , resetPassowrd, getUserDetail, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require('../controllers/userController')
const { isAuthenciatedUser, authorizeRole } = require('../middleware/auth')
const router= express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forget').post(forgotPassword)
router.route('/logout').get(logOut)

router.route('/password/reset/:token').put(resetPassowrd)

router.route('/me').get(isAuthenciatedUser, getUserDetail)
router.route('/me/update').put(isAuthenciatedUser, updateProfile)

router.route('/password/update').put (isAuthenciatedUser, updatePassword)
router.route('/admin/users').post(isAuthenciatedUser, authorizeRole('admin'), getAllUsers)
router.route('/admin/user/:id').get(isAuthenciatedUser, authorizeRole('admin'), getSingleUser).put(isAuthenciatedUser, authorizeRole('admin'), updateUserRole).delete(isAuthenciatedUser, authorizeRole('admin'),deleteUser)

module.exports=router