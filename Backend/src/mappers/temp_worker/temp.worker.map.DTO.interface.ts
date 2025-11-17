import { Types } from "mongoose";
import { ILocation } from "../../model/location/location.interface";

export interface ITempWorkerDTO {
    id: string;
    otp: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    location: ILocation,
    categories: Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

export interface ITempWorkerEntity {
    id: string;
    otp: string;
    name: string,
    email: string,
    phone: string,
    password: string,
    location: ILocation,
    categories: Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}


