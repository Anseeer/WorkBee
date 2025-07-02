import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConfigDB from "./config/db";

dotenv.config();
ConfigDB();

const app = express();
app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.get('/',(_,res)=>{
    res.send('WorkBee API is running');
})

app.listen(process.env.PORT,()=>{
    console.log(`listening on Port http://localhost:3003/`)
});