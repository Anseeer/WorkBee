import mongoose from "mongoose";
import { INotification } from "../../model/notification/notification.interface";
import { INotificationDTO } from "./INotification.DTO";

export const mapNotificationToDTO = (notification: Partial<INotification>): INotificationDTO => {
    return {
        recipient: notification.recipient
            ? new mongoose.Types.ObjectId(notification.recipient)
            : undefined,
        recipientModel: notification.recipientModel,
        actor: notification.actor
            ? new mongoose.Types.ObjectId(notification.actor)
            : undefined,
        actorModel: notification.actorModel,
        type: notification.type!,
        title: notification.title!,
        body: notification.body!,
        read: notification.read ?? false,
        createdAt: notification.createdAt ?? new Date(),
    };
};