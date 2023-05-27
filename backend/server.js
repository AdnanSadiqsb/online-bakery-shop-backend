const app= require('./app')
const dotenv= require('dotenv')
const cloudinary= require('cloudinary')
dotenv.config({path:'backend/config/config.env'})
const connectToDatabase = require('./config/databse')


connectToDatabase()
const PORT = process.env.PORT || 4000
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server =app.listen(PORT,()=>{
    console.log(`server is working on https://localhost:${PORT}`)
})

// handling uncught error like we use a thing that is not defined
process.on('uncaughtException',(err)=>{
    console.log(`Error ${err.message}`)
    console.log(`shutting down the  server due to uncught arror`)
    server.close(()=>{
        process.exit(1)
    })
})





// unhandled promise rejection like if mogo connection string is not given correctly
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the  server due to unhandled rejection`)
    server.close(()=>{
        process.exit(1)
    })
})
