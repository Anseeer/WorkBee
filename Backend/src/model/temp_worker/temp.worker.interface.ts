import { Document, Types } from "mongoose"
import { ILocation } from "../location/location.interface"

export interface ITempWorker extends Document {
    name: string,
    email: string,
    otp: string,
    phone: string,
    password: string,
    location: ILocation,
    categories: Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}