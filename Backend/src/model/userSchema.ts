import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { LocationSchema } from "./locationSchema";

export interface Iuser extends Document {
    name:string,
    email:string,
    phone:string,
    password:string,
    location: {
    address: string;
    pincode: string;
    lat: number;
    lng: number;
    },
    profileImage:string,
    isActive:boolean,
    role:string,
    createdAt:Date,
    updatedAt:Date
}

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