const mongoose =require('mongoose')

const CategorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Pleade Enter Category name"],
        unique:[true,"Category with this name already exist"]        
    },
    tags:{
        type:[String],
        required:[true, "Pleade Enter Category tags"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },

})


module.exports=mongoose.model("Category",CategorySchema)