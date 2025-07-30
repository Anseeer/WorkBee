import mongoose, { Document, Types } from "mongoose"
import { ILocation } from "../location/location.interface"

export interface IWorker extends Document {
    _id: string | Types.ObjectId,
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
    services: Types.ObjectId[],
    categories: Types.ObjectId[],
    subscription: {
        plan: mongoose.Schema.Types.ObjectId;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    },
    createdAt: Date,
    updatedAt: Date
    isAccountBuilt:boolean
    }