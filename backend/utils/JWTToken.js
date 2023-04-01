//get token and saving in coookies

const sendToken=(user,statusCode,res)=>{
    //getjwtToken is written in model of user
    const token= user.getJWTToken()
    //option for cookies

    const options={
        expires:new Date(
            Date.now() +process.env.COOKIES_EXPIRE *24*60*60*1000
        ),
        httpOnly:true

    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token

    })
}
module.exports= sendToken