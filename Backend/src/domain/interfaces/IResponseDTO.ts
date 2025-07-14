import { Types } from "mongoose";

export interface IUserResponseDTO {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: {
        address: string,
        pincode: string,
        lat: number,
        lng: number
    },
    profileImage: string,
    isActive: boolean,
    role: string
}

export interface IWorkerResponseDTO {
    id:string|Types.ObjectId,
    name:string,
    email:string,
    phone:string,
    role:string,
    workType:string[],
    preferredSchedule:string[],
    isActive:boolean,
    isVerified:boolean,
    location:{
        address:string,
        pincode:string,
        lat:number,
        lng:number
    },
    services:Types.ObjectId[],
    categories:Types.ObjectId[],
    age:number,
    bio:string,
    minHour:string,
    profileImage:string,
    govId:string,
    subscription:boolean
}   

export interface IAdminResponseDTO{
    _id:Types.ObjectId,
    name:string,
    phone:string,
    email:string,
    role:string,
}