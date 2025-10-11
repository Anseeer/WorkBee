import mongoose from "mongoose"

export interface ISubscriptionDTO {
    name: string,
    description: string,
    comission: string,
    amount: string,
    isActive: boolean,
    durationInDays: string,
    paymentId: string
}


export interface ISubscriptionEntity {
    planName: string,
    description: string,
    comission: number,
    amount: number,
    isActive: boolean,
    durationInDays: number,
    paymentId: mongoose.Schema.Types.ObjectId
}