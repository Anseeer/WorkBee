import mongoose, { Schema } from "mongoose";
import { IWorker } from "./worker.interface";
import { locationSchema } from "../location/location.model";


const workerSchema = new Schema<IWorker>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category',
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    services: [
        {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            unit: { type: String, enum: ["hour"], default: "hour" }
        }
    ],
    bio: {
        type: String,
        required: false
    },
    completedWorks: {
        type: Number,
        required: false,
        default: 0
    },
    radius: {
        type: Number,
        required: false
    },
    preferredSchedule: {
        type: [String],
        enum: ['morning', 'afternoon', 'evening', 'night', 'full-day'],
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: "Worker"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending Approval", "Approved", "Rejected", "Re-approval"],
        default: "Pending Approval",
    },
    govId: {
        type: [String],
        required: false
    },
    ratings: {
        average: {
            type: Number,
            default: 0
        },
        ratingsCount: {
            type: Number,
            default: 0
        }
    },
    subscription: {
        type: {
            plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: false },
            startDate: { type: Date, required: false },
            endDate: { type: Date, required: false },
            commission: { type: String }
        },
        default: null,
    },
    isAccountBuilt: { type: Boolean, default: false }
}, { timestamps: true });

const Worker = mongoose.model<IWorker>('Worker', workerSchema);
export default Worker;