import { Types } from "mongoose";
import { ISelectedService } from "../../model/service/service.interface";

export interface IWorkerDTO {
    id: Types.ObjectId | string;
    _id?: string,
    name: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    rejectionReason: string;
    status: string;
    radius: number;
    isAccountBuilt: boolean;
    completedWorks: number;
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    services: ISelectedService[];
    categories: string[];
    age: number;
    bio: string;
    profileImage: string;
    govId: string[];
    ratings: {
        average: number,
        ratingsCount: number
    };
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        commission: string;
    } | null;
    createdAt: Date | string;
}

export interface IWorkerEntity {
    id: Types.ObjectId | string;
    _id?: string,
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    status: string;
    radius: number;
    isAccountBuilt: boolean;
    completedWorks: number;
    location: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    services: ISelectedService[];
    categories: Types.ObjectId[];
    age: number;
    bio: string;
    profileImage: string;
    govId: string[];
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        commission: string;
    } | null;
    createdAt: Date;
}

