import { Types } from "mongoose";

export interface IWorkerDTO {
    id: string | Types.ObjectId,
    name: string,
    email: string,
    phone: string,
    role: string,
    workType: string[],
    preferredSchedule: string[],
    isActive: boolean,
    isVerified: boolean,
    location: {
        address: string,
        pincode: string,
        lat: number,
        lng: number
    },
    services: Types.ObjectId[],
    categories: Types.ObjectId[],
    age: number,
    bio: string,
    minHour: string,
    profileImage: string,
    govId: string,
    subscription: boolean
}   
