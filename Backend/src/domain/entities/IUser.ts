import { Document } from "mongoose";

export interface Iuser extends Document {
    _id: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    },
    profileImage: string,
    isActive: boolean,
    role: string,
    createdAt: Date,
    updatedAt: Date
}