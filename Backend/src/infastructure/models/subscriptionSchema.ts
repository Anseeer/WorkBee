import mongoose, { Schema } from "mongoose";
import { ISubscription } from "../../domain/entities/ISubscription";

export const subscriptionSchema = new Schema<ISubscription>({
    planName: {
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
        default: false
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    }
});

const Subscription = mongoose.model<ISubscription>('Subscription',subscriptionSchema);
export default Subscription;