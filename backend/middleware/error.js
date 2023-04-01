const ErrorHandler = require('../utils/errorHandler')

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500,
    err.message= err.message ||"internal server error"

    // handle wrong mongodb id error
    if(err.name==='CastError')
    {
     const message=`resource not found invalid : ${err.path}` 
     err=new ErrorHandler(message,400)  
    }
    // wrong JWT error
    if(err.name==-'jsonWebTokenError')
    {
        const message=`json web token is invalid, try again` 
        err=new ErrorHandler(message,400)  
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    });
}