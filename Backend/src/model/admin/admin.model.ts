import mongoose, { Schema } from "mongoose";
import { IAdmin } from "./admin.interface";

const adminSchema = new Schema<IAdmin>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user", "worker"],
        default: 'admin'
    }
}, { timestamps: true });

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;