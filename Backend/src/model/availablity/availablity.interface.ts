import mongoose from "mongoose";

export interface ISlot extends Document {
    startTime: string;
    endTime: string;
    isBooked: boolean;
    jobId: mongoose.Schema.Types.ObjectId;
    scheduleType: string
}

export interface IAvailableSlot extends Document {
    date: string;
    slots: ISlot[];
}


export interface IAvailability extends Document {
    workerId: mongoose.Schema.Types.ObjectId;
    availableSlots: IAvailableSlot[];

}