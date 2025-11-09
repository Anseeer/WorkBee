import { Document, Types } from "mongoose"
import { ILocation } from "../location/location.interface"
import { ISelectedService } from "../service/service.interface";

export interface IWorker extends Document {
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
    preferredSchedule: string[],
    isVerified: boolean,
    status: string,
    isActive: boolean,
    location: ILocation,
    govId: string[],
    services: ISelectedService[],
    categories: Types.ObjectId[],
    ratings: {
        average: number,
        ratingsCount: number
    },
    subscription: {
        plan: Types.ObjectId;
        startDate: Date;
        endDate: Date;
        commission: string,
    } | null,
    createdAt: Date,
    updatedAt: Date
    isAccountBuilt: boolean
}