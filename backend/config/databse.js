const mongoose=require('mongoose')

const connectToDatabase=()=>{
    //process.env.DB_URL  ------live db url
    // process.env.LOCAL_DB_URL------local bd
    mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true }).then((data)=>{
 
        console.log(`mongo db is connected with server ${data.connection.host}`)
    
    }).catch(()=>{
        console.log("mongo db is not connected with server internal error")
        process.exit(1)
    })
}

module.exports=connectToDatabase