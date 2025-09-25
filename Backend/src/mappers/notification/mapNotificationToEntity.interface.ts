import mongoose from "mongoose";

export interface INotificationEntity {
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
