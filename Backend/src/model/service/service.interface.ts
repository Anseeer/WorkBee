import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IServices extends Document {
    category: mongoose.Schema.Types.ObjectId,
    name: string,
    description: string,
    wage: string,
    isActive: boolean
}