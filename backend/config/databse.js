const mongoose=require('mongoose')

const connectToDatabase=()=>{
    mongoose.connect(process.env.DB_URL).then((data)=>{
        console.log(`mongo db is connected with server ${data.connection.host}`)
    
    })
}

module.exports=connectToDatabase