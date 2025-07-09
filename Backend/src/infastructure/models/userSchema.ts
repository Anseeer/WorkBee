import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { LocationSchema } from "./locationSchema";
import { Iuser } from "../../domain/entities/IUser";


const userSchema = new Schema<Iuser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    location:{
        type:LocationSchema,
        required:true
    },
    profileImage:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    role:{
        type:String,
        required:true,
        default:'User'
    }
},
{
    timestamps:true
}
);

const User = mongoose.model<Iuser>("User",userSchema);
export default User;