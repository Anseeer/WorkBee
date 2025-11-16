import mongoose, { Schema } from "mongoose";
import { locationSchema } from "../location/location.model";
import { ITempUser } from "./temp.user.interface";


const userSchema = new Schema<ITempUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    profileImage: {
        type: String
    },
    otp: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

const TempUser = mongoose.model<ITempUser>("TempUser", userSchema);
export default TempUser;