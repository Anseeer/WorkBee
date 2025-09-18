import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    recipientModel: string;
    actor?: mongoose.Types.ObjectId;
    actorModel?: string;
    title: string;
    type: string;
    body: string;
    read: boolean;
    createdAt: Date;
}
