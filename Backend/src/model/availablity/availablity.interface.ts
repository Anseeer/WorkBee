import mongoose, { Document } from "mongoose";

export interface ISlot extends Document {
    date: Date;
    availableSlots: {
        slot: "morning" | "afternoon" | "evening" | "full-day";
        booked?: boolean;
        jobId?: mongoose.Types.ObjectId;
    }[];
}

export interface IAvailability extends Document {
    workerId: mongoose.Schema.Types.ObjectId;
    availableDates: ISlot[];
}
