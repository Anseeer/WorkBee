import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import MongooseConnection from "./infastructure/database/mongoose";

dotenv.config();
MongooseConnection();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


app.use('/api/users',userRoutes)

app.get('/',(_,res)=>{
    res.send('WorkBee API is running');
})

app.listen(process.env.PORT,()=>{
    console.log(`listening on Port http://localhost:3003/`)
}); 