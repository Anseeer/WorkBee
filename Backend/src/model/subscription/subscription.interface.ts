import mongoose, { Document } from "mongoose";

export interface ISubscription extends Document {
    _id:string,
    planName: string,
    description: string,
    comission: number,
    amount: number,
    isActive: boolean,
    durationInDays: number,
    paymentId: mongoose.Schema.Types.ObjectId
}