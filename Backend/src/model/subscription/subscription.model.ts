import mongoose, { Schema } from "mongoose";
import { ISubscription } from "./subscription.interface";

export const subscriptionSchema = new Schema<ISubscription>({
    planName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    comission: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    durationInDays: {
        type: Number,
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: false
    }
});

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;