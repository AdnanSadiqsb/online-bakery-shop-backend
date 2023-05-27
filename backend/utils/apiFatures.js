class Apifeatures{
    constructor(query,queryStr)
    {
        this.query=query
        this.queryStr=queryStr

    }

    search(){
        const keyword=this.queryStr.keyword
        ?
        {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i',
            }
            
        }:{}
        
        
        this.query=this.query.find({...keyword})
        return this
    }
    filter()
    {
        //{...this.queryStr} is used to make the copy 
        const queryCopy= {...this.queryStr}
        // removing some fields for category
        const removeFields=["keyword","page","limit"]
        removeFields.forEach((key)=>{
            delete queryCopy[key]
        })

        // filter for price and rating
        let quryStr=JSON.stringify(queryCopy)
        // replace price lte to $lte 
        quryStr=quryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)
        quryStr=JSON.parse(quryStr)
        this.query=this.query.find(quryStr)
        return this
    }
    sortAsNew(resultPerPage){
        if(this.queryStr.new)
        {
            this.query=this.query.find().sort({cratedAt:'desc'}).limit(resultPerPage)

        }
        return this
    }


    pagination(resultPerPage)
    {
        const currentPage=Number (this.queryStr.page) ||1  //50  10

        const skip=resultPerPage * (currentPage -1)
        this.query=this.query.limit(resultPerPage).skip(skip)
        return this

    }
}

module.exports=Apifeatures