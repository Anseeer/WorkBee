import { Document, Types } from "mongoose";

export interface IAdmin extends Document {
    _id: Types.ObjectId,
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    createdAt: Date,
    updatedAt: Date
}