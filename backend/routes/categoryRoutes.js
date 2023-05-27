const express = require('express')
const { addCategory, getAllCategories} = require('../controllers/categoryController')
const { isAuthenciatedUser, authorizeRole } = require('../middleware/auth')
const router= express.Router()

router.route('/admin/add/category').post(isAuthenciatedUser, authorizeRole('admin'), addCategory)
router.route('/categories').post(getAllCategories)

module.exports=router