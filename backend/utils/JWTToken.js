// get token and saving in coookies

const sendToken=(user,statusCode,res)=>{


        //getjwtToken is written in model of user
        const token= user.getJWTToken()
        //option for cookies
        
        const options={
            expires:new Date(
                Date.now() +process.env.COOKIES_EXPIRE *24*60*60*1000
                ),
        httpOnly:false
        
    }
    // console.log(token, user);
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
        
    })
  

}
module.exports= sendToken


//may use this when live
// domainurl="https://fyp-onile-bakery-shop.netlify.app"  //live
// localurl="http://localhost:3000"
// const sendToken = (user, statusCode, res) => {
//     const token = user.getJWTToken()
  
//     const options = {
//       expires: new Date(Date.now() + process.env.COOKIES_EXPIRE * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       domain: localurl // replace with your actual domain
//     }
  
//     res.set('Access-Control-Allow-Credentials', 'true')
//     res.set('Access-Control-Allow-Origin', localurl)
  
//     res.status(statusCode).cookie('token', token, options).json({
//       success: true,
//       user,
//       token
//     })
//   }
  
//   module.exports = sendToken
  