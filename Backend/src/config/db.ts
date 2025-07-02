import mongoose from "mongoose";

const ConfigDB = ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI as string)
        .then(()=>{
            console.log("DB Contected Successfully...")
        })
        .catch((err)=>{
            console.log("DB Connection Faild ",err)
        })
    } catch (error) {
        console.log(error);
    }
}

export default ConfigDB;