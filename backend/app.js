const express= require('express')
const cors=require('cors')
const app=express()
// app.use(cors())
const bodyParser=require('body-parser')
const fileUpload=require('express-fileupload')

const dotenv=require('dotenv')
app.use(express.json({
  limit: '50mb'
}));
const corsOptions = {
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true, // This is important.
  origin: "https://teal-crazy-chicken.cyclic.app",
};
app.use(cors(corsOptions));
// app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
dotenv.config({path:'backend/config/config.env'})
const cookieParser=require('cookie-parser')
app.use(express.json())
app.use(cookieParser());
//for image upload
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

app.get('/', function (req, res) {
    res.status(200).send('Welcome to Online Bakery shop');
  });
const errorMiddleware= require('./middleware/error')
//rote imports
const userRoute=require('./routes/userRoutes')
const productRoute=require('./routes/productRoutes')
const orderRoute=require('./routes/orderRoutes')
const paymentRoute= require('./routes/paymentRoutes')
app.use("/api/v1",productRoute);
app.use('/api/v1',userRoute);
app.use("/api/v1",orderRoute);
app.use('/api/v1', paymentRoute)

// Middleware for error
app.use(errorMiddleware)




module.exports=app