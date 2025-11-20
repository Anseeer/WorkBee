import mongoose from "mongoose";

export interface ISlotDTO {
    date: Date;
    availableSlots: {
        slot: "morning" | "afternoon" | "evening" | "full-day";
        jobId?: mongoose.Types.ObjectId;
    }[];
}

export interface IAvailabilityDTO {
    _id?: string,
    workerId: mongoose.Schema.Types.ObjectId;
    availableDates: ISlotDTO[];
}

export interface IAvailabilitEntity {
    workerId: mongoose.Schema.Types.ObjectId;
    availableDates: ISlotDTO[];
}