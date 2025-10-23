import mongoose, { Schema } from "mongoose";
import { IServices } from "./service.interface";

export const serviceSchema = new Schema<IServices>({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    wage: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

const Services = mongoose.model<IServices>('Services', serviceSchema);
export default Services;