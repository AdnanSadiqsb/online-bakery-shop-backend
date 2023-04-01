const express=require('express')
const { getAllProducts, createProduct, updateProducts, delteProduct, getProductDetails, createProductReview, getAllReviewsOfProdutc, deleteReviewOfProdutc, getAllProductsAdmin } = require('../controllers/productController')
const { isAuthenciatedUser, authorizeRole } = require('../middleware/auth')
const router= express.Router()




router.route("/admin/products/new").post(isAuthenciatedUser,authorizeRole("admin"),  createProduct)
router.route("/products").get( getAllProducts)
router.route("/admin/products/:id")
.put(isAuthenciatedUser,authorizeRole("admin"), updateProducts).
delete(isAuthenciatedUser,authorizeRole("admin"), delteProduct)

router.route('/product/:id').get(getProductDetails)
router.route('/review').put(isAuthenciatedUser,createProductReview);
router.route('/reviews').get(getAllReviewsOfProdutc).delete(deleteReviewOfProdutc);
router.route('/admin/products').get(isAuthenciatedUser, authorizeRole('admin'), getAllProductsAdmin)

module.exports = router