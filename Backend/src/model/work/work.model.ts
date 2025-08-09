import mongoose, { Schema } from "mongoose";
import { IWork} from "./work.interface";

const workSchema = new Schema<IWork>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    wage: {
        type: String,
        required: false
    },
    location: {
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    workType: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    sheduleDate: {
        type: String,
        required: true
    },
    sheduleTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending'
    }

}, { timestamps: true })

const Work = mongoose.model<IWork>("Work", workSchema);
export default Work;