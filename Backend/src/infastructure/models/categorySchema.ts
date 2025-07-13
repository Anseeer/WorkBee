import mongoose, { Schema } from "mongoose";
import { ICategory } from "../../domain/entities/ICategory";

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;