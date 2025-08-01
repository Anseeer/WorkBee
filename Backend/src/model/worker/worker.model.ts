import mongoose, { Schema } from "mongoose";
import { IWorker } from "./worker.interface";
import { locationSchema } from "../location/location.model";


const workerSchema = new Schema<IWorker>({
    // registration
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
    // account building
    profileImage: {
        type: String,
        required: false
    },
    services: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Services',
        required: false
    },
    bio: {
        type: String,
        required: false
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
    govId: {
        type: [String],
        required: false
    },
    subscription: {
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: false },
        startDate: { type: Date, required: false },
        endDate: { type: Date, required: false },
        isActive: { type: Boolean, default: false }
    },
    isAccountBuilt: { type: Boolean, default: false }
}, { timestamps: true });

const Worker = mongoose.model<IWorker>('Worker', workerSchema);
export default Worker;