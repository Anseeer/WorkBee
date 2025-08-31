import mongoose from "mongoose";

export interface IServiceDTO {
    category: mongoose.Schema.Types.ObjectId,
    name: string,
    description: string,
    wage: string,
    isActive: boolean
}

export interface IServiceEntity {
    category: mongoose.Schema.Types.ObjectId,
    name: string,
    description: string,
    wage: string,
    isActive: boolean
}