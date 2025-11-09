import mongoose from "mongoose";
import { Document } from "mongoose";

export interface ISelectedService {
    serviceId: string
    name: string
    price: number
    unit: "hour"
}

export interface IServices extends Document {
    serviceDescription?: string;
    serviceName?: string;
    serviceId?: string;
    categoryId?: string;
    category: mongoose.Schema.Types.ObjectId,
    categoryName?: string,
    categoryIcon?: string,
    name: string,
    description: string,
    image: string,
    isActive: boolean
}