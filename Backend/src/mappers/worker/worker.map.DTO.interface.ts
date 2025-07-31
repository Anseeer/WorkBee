import { Types } from "mongoose";

export interface IWorkerDTO {
    id: Types.ObjectId | string;  
    name: string;
    email: string;
    phone: string;
    role: string;
    workType: string[];
    preferredSchedule: string[];
    isActive: boolean;
    isVerified: boolean;
    isAccountBuilt: boolean;
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    services: string[]; 
    categories: string[];
    age: number;
    bio: string;
    minHours: string; 
    profileImage: string;
    govId: string;
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    } | null; 
}
