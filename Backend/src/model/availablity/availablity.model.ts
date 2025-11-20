import mongoose, { Schema } from "mongoose";
import { IAvailability } from "./availablity.interface";

const availabilitySchema = new Schema<IAvailability>({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true
    },
    availableDates: [{
        date: {
            type: Date,
            required: true
        },
        availableSlots: [{
            slot: {
                type: String,
                enum: ["morning", "afternoon", "evening", "full-day"],
                required: true
            },
            booked: {
                type: Boolean,
                default: false
            },
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
                required: false
            }
        }]
    }]
}, { timestamps: true });


export const Availability = mongoose.model<IAvailability>("Availability", availabilitySchema);
