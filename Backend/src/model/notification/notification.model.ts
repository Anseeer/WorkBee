import mongoose, { Schema } from "mongoose";
import { INotification } from "./notification.interface";

const NotificationSchema = new Schema<INotification>({
    recipient: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    recipientModel: {
        type: String,
        enum: ["User", "Worker"],
        required: true,
    },
    actor: {
        type: Schema.Types.ObjectId,
    },
    actorModel: {
        type: String,
        enum: ["User", "Worker"],
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["job_request", "job_completed", "job_accepted", "job_paid", "job_cancelled"],
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;