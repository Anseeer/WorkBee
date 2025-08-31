import mongoose, { ObjectId } from "mongoose";
import { Types } from "mongoose";

export interface IWorkerDTO {
    id: Types.ObjectId | string;
    _id?: string,
    name: string;
    email: string;
    phone: string;
    role: string;
    workType: string[];
    preferredSchedule: string[];
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
    services: string[];
    categories: string[];
    age: number;
    bio: string;
    profileImage: string;
    govId: string[];
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
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
    workType: string[];
    preferredSchedule: string[];
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
    services: Types.ObjectId[];
    categories: Types.ObjectId[];
    age: number;
    bio: string;
    profileImage: string;
    govId: string[];
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    } | null;
    createdAt: Date;
}

