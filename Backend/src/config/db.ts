import mongoose from "mongoose";

const ConfigDB = ()=>{
    console.log('Trying to Conect...')
    try {
        mongoose.connect(process.env.MONGODB_URI as string)
        .then(()=>{
            console.log("DB Contected Successfully...")
        })
        .catch((err)=>{
            console.log("DB Connection Faild ",err)
        })
    } catch (error) {
        console.log("Faild To Connect",error);
    }
}

export default ConfigDB;