import { Document, Types } from "mongoose"
import { ILocation } from "../location/location.interface"

export interface IWorker extends Document {
    // _id: string | Types.ObjectId,
    name: string,
    email: string,
    phone: string,
    password: string,
    age: number,
    bio: string,
    profileImage: string,
    role: string,
    radius: number,
    completedWorks: number,
    workType: string[],
    preferredSchedule: string[],
    isVerified: boolean,
    status: string,
    isActive: boolean,
    location: ILocation,
    govId: string[],
    services: Types.ObjectId[],
    categories: Types.ObjectId[],
    ratings: {
        average: number,
        ratingsCount: number
    },
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    } | null,
    createdAt: Date,
    updatedAt: Date
    isAccountBuilt: boolean
}