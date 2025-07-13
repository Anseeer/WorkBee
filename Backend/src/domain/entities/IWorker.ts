import mongoose, { Document } from "mongoose"
import { ICategory } from "./ICategory"
import { ILocation } from "./ILocation"
import { IServices } from "./IServices"

export interface IWorker extends Document {
    workerId: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    age: number,
    bio: string,
    profileImage: string,
    role: string,
    minHours: string,
    workType: string[],
    preferredSchedule: string[],
    isVerified: boolean,
    isActive: boolean,
    location: ILocation,
    govId: string,
    services: IServices,
    categories: ICategory,
    subscription: {
        plan: mongoose.Schema.Types.ObjectId;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    },
    createdAt: Date,
    updatedAt: Date
}