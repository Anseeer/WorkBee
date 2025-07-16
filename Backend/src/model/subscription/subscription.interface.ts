import mongoose from "mongoose";

export interface ISubscription {
    planName: string,
    comission: number,
    amount: number,
    isActive: boolean,
    paymentId: mongoose.Schema.Types.ObjectId
}