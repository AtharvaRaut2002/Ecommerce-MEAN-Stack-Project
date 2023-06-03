import express from "express";
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import cors from 'cors'
import router from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoute.js";
//Configure env
dotenv.config();

//database Config
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', router)
app.use('/api/v1/product', productRoute)

//rest api

app.get("/", (req, res) => {
    res.send('<h1>Welcome to MEAN Stack Ecommerce app</h1>');
});

//Post
const PORT = process.env.PORT || 8000;

//run listen
app.listen(PORT, ()=>{
    console.log(`Server Running on ${PORT}`.bgCyan.white)
});