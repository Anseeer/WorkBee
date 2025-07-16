import mongoose, { Schema } from "mongoose";
import { Iuser } from "./user.interface";
import { locationSchema } from "../location/location.model";


const userSchema = new Schema<Iuser>({
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
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        required: true,
        default: 'User'
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model<Iuser>("User", userSchema);
export default User;