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

export const seed = async () => {
  const categories = [
    { name: "Cleaning", description: "House and office cleaning", isActive: true },
    { name: "Home Repair", description: "Electrical and plumbing repairs", isActive: true },
    { name: "Outdoor", description: "Garden, lawn and exterior work", isActive: true },
    { name: "Servant", description: "Domestic help", isActive: true },
  ];

  await Category.insertMany(categories);
  console.log("Sample categories seeded!");

  await mongoose.disconnect();
};

