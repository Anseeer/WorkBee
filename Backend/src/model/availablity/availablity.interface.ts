import mongoose, { Document } from "mongoose";

export interface ISlot extends Document {
    date: Date;                
    bookedSlots: string[];     
}

export interface IAvailability extends Document {
    workerId: mongoose.Schema.Types.ObjectId;
    availableDates: ISlot[];
}
