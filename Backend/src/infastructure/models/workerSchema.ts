import mongoose, { Schema } from "mongoose";
import { IWorker } from "../../domain/entities/IWorker";
import { locationSchema } from "./locationSchema";


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
    age: {
        type: Number,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: "worker"
    },
    minHours: {
        type: String,
        required: false
    },
    workType: {
        type: [String],
        enum: ['one-time', 'weekly', 'monthly', 'long-term'],
        required: false
    },
    preferredSchedule: {
        type: [String],
        enum: ['morning', 'afternoon', 'evening', 'night', 'flexible'],
        required: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    govId: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    services: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Services',
        required: false
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category',
        required: true
    },
    subscription: {
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: false },
        startDate: { type: Date, required: false },
        endDate: { type: Date, required: false },
        isActive: { type: Boolean, default: false }
    }
}, { timestamps: true });

const Worker = mongoose.model<IWorker>('Worker', workerSchema);
export default Worker;