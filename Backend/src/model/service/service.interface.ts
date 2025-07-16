import mongoose from "mongoose";

export interface IServices {
    category: mongoose.Schema.Types.ObjectId,
    name: string,
    description: string,
    wage: string,
    isActive: boolean
}