const { findById } = require('../models/productModel');
const Product =require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError=require('../middleware/catchAsyncError')
const Apifeatures = require('../utils/apiFatures')
const cloudinary =require('cloudinary')
//Create product controller --Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLink;
    req.body.user = req.user.id;
    console.log(req.body.discount);
    const product = await Product.create(req.body);
    res.status(200).json({
      success: true,
      product,
    });
  });
  

// get all Products
exports.getAllProducts=catchAsyncError(
    async (req,res,next)=>{

        let sortBy = req.query.sortBY; // assuming this is the input value, 'name-asc' means sort by product name A-Z, 'name-desc' means sort by product name Z-A

        let sortCriteria = {}; // create an empty object to hold the sorting criteria

        // add the sorting criteria based on the input value
        if (sortBy === 'rating-desc') {
        sortCriteria.total_rating = -1; // sort by rating high to low
        } else if (sortBy === 'rating-asc') {
            sortCriteria.total_rating = 1; // sort by newness
        }  else if (sortBy === 'newness-desc') {
        sortCriteria.cratedAt = -1; // sort by newness
        } else if (sortBy === 'newness-asc') {
            sortCriteria.cratedAt = 1; // sort by oldness
        }else if (sortBy === 'price-asc') {
        sortCriteria.price = 1; // sort by price low to high
        } else if (sortBy === 'price-desc') {
        sortCriteria.price = -1; // sort by price high to low
        } else if (sortBy === 'name-asc') {
        sortCriteria.name = 1; // sort by product name A-Z
        } else if (sortBy === 'name-desc') {
        sortCriteria.name = -1; // sort by product name Z-A
        }
        else{
            sortCriteria.cratedAt = 1;
        }
        const resultPerPage=req.query.resultPerPage
        const productCount=await Product.countDocuments()

        const apiFeatures=new Apifeatures(Product.find().sort(sortCriteria), req.query).search().filter().sortAsNew(resultPerPage)

        let products= await apiFeatures.query.clone()
        const filterProductsLength=products.length
        apiFeatures.pagination(resultPerPage)
        products=await apiFeatures.query
        res.status(200).json({
            success:true,
            products,
            productCount,
            resultPerPage,
            filterProductsLength
        })
    
    }
)

// get all Products --Admin
exports.getAllProductsAdmin=catchAsyncError(
    async (req,res,next)=>{
        
        let sortBy = req.query.sortBY; // assuming this is the input value, 'name-asc' means sort by product name A-Z, 'name-desc' means sort by product name Z-A

        let sortCriteria = {}; // create an empty object to hold the sorting criteria

        // add the sorting criteria based on the input value
        if (sortBy === 'rating-desc') {
        sortCriteria.total_rating = -1; // sort by rating high to low
        } else if (sortBy === 'rating-asc') {
            sortCriteria.total_rating = 1; // sort by newness
        }  else if (sortBy === 'newness-desc') {
        sortCriteria.cratedAt = -1; // sort by newness
        } else if (sortBy === 'newness-asc') {
            sortCriteria.cratedAt = 1; // sort by oldness
        }else if (sortBy === 'price-asc') {
        sortCriteria.price = 1; // sort by price low to high
        } else if (sortBy === 'price-desc') {
        sortCriteria.price = -1; // sort by price high to low
        } else if (sortBy === 'name-asc') {
        sortCriteria.name = 1; // sort by product name A-Z
        } else if (sortBy === 'name-desc') {
        sortCriteria.name = -1; // sort by product name Z-A
        }
        else{
            sortCriteria.cratedAt = 1;
        }
        const name = req.query.keyword;

		// Define the filter object based on the name query parameter
		const filter = name ? { name: { $regex: name, $options: "i" } } : {};
        const products=await Product.find(filter).sort(sortCriteria)
        res.status(200).json({
            success:true,
            products
        })
    
    }
)
//update product  --Admin
exports.updateProducts =catchAsyncError(
    async(req,res,next)=>{
        let product=await Product.findById(req.params.id);
        if(!product)
        {
            return next(new ErrorHandler("product not found",404))
    
        }
        let images=[]
      
        if(typeof( req.body.images)==="string")
        {
            images.push(req.body.images)
        }
        else{
            images=req.body.images
        }
        if(images !== undefined)
        {
            //delete images
            for(let i=0;i<product.images.length;i++)
                {
                    await cloudinary.v2.uploader.destroy(product.images[i].public_id)

                }
                const imagesLink=[]
                for(let i=0; i<images.length;i++)
                {
                    const result= await cloudinary.v2.uploader.upload(images[i],{
                    folder:"products"
                    });
                 imagesLink.push({
                    public_id:result.public_id,
                 url:result.secure_url
                })
            }
            req.body.images=imagesLink
        }
      
        product=await Product.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            product
        })
    
    
    }
)

//Dalte product --admin
exports.delteProduct=catchAsyncError(
    async(req,res,next)=>{

        const product = await Product.findById(req.params.id)
        if(!product)
        {
            return next(new ErrorHandler("product not found",404))
    
        }
        //Delteing images from cloudinary
        for(let i=0;i<product.images.length;i++)
        {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)

        }
        await product.remove();
        res.status(200).json({
            success:true,
            message:"product deleted succcess fuly"
    
        })
    }
)
 
//get single product details

exports.getProductDetails =catchAsyncError(
    async(req,res,next)=>{
        const productCount=await Product.countDocuments()
        const product= await Product.findById(req.params.id).populate("reviews.user", "avatar");
        if(!product)
        {
            return next(new ErrorHandler("product not found",404))
        
        }
        res.status(200).json({
            success:true,
            product,
            productCount
    
        })
    
    }
)


//create new review or update review
exports.createProductReview=catchAsyncError(
    async(req,res,next)=>
    {
        const {rating, comment, productId}= req.body
        const review={
            user:req.user._id,
            name:req.user.name,
            rating: Number(rating),
            comment
        }
        const product = await Product.findById(productId)
        const existingReview = product.reviews.find(review => review.user.toString() === req.user._id.toString());
        if(existingReview)
        {
            existingReview.rating = rating;
            existingReview.comment = comment;
        }
        else{
            product.reviews.push(review)
            product.numOfReviews=product.reviews.length
        }
        let avg=0
        product.reviews.forEach(rev=>{
            avg+=rev.rating
        })
        product.total_rating=avg/product.reviews.length
        await product.save({validateBeforeSave:false})
        res.status(200).json(
            {
                success:true,
                review
            }
        )

});


//get all reviews of a single product

exports.getAllReviewsOfProdutc=catchAsyncError(
    async(req,res,next)=>{
        const product=await Product.findById(req.query.id)
        if(!product){
            return next(new ErrorHandler("product not found",400))

        }
        res.status(200).json({
            succcess:true,
            reviews:product.reviews
        })
    }
)

// delete review

exports.deleteReviewOfProdutc=catchAsyncError(
    async(req,res,next)=>{
        const product=await Product.findById(req.query.productId)
        if(!product){
            return next(new ErrorHandler("product not found hw",400))

        }

        const reviews=product.reviews.filter(rev=>rev._id.toString() !== req.query.reviewId.toString())
        let avg=0
        reviews.forEach(rev=>{
            avg+=rev.rating
        })
        product.reviews=reviews
        product.total_rating=avg/product.reviews.length
        product.numOfReviews=reviews.length
        await product.save({validateBeforeSave:false})

        res.status(200).json({
            succcess:true,
            message:"review deleted successfuly"
        })
    }
)




