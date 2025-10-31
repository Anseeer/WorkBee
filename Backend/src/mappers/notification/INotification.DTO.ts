import mongoose from "mongoose";

export interface INotificationDTO {
    recipient?: mongoose.Types.ObjectId;
    recipientModel?: string;
    actor?: mongoose.Types.ObjectId;
    actorModel?: string;
    type: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: Date;
}
