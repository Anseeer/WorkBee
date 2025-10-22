import mongoose from "mongoose";

export interface IServiceDTO {
    _id: string,
    category: mongoose.Schema.Types.ObjectId,
    categoryName?:string,
    categoryId?:string,
    categoryIcon?:string,
    name: string,
    description: string,
    wage: string,
    image: string,
    isActive: boolean
}

export interface IServiceEntity {
    _id: string,
    category: mongoose.Schema.Types.ObjectId,
    name: string,
    description: string,
    wage: string,
    image: string,
    isActive: boolean
}