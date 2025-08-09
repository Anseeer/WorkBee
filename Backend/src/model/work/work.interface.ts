import mongoose, { Document } from "mongoose";
import { ILocation } from "../location/location.interface";

export interface IWork extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    workerId: mongoose.Schema.Types.ObjectId,
    serviceId: mongoose.Schema.Types.ObjectId,
    categoryId: mongoose.Schema.Types.ObjectId,
    wage:string,
    location:ILocation,
    workType:string,
    size:string,
    description:string,
    sheduleDate:string,
    sheduleTime:string,
    status:string,
    paymentStatus:string,
    createdAt:Date,
    updatedAt:Date,
}