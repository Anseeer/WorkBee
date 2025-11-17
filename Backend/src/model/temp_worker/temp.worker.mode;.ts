import mongoose, { Schema } from "mongoose";
import { locationSchema } from "../location/location.model";
import { ITempWorker } from "./temp.worker.interface";

const tempWorkerSchema = new Schema<ITempWorker>({
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
    otp: {
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
    }
}, { timestamps: true });

const TempWorker = mongoose.model<ITempWorker>('TempWorker', tempWorkerSchema);
export default TempWorker;