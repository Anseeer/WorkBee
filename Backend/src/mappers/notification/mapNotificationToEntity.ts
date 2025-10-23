import mongoose from "mongoose";
import { INotification } from "../../model/notification/notification.interface";
import { INotificationEntity } from "./mapNotificationToEntity.interface";

export const mapNotificationToEntity = (
    notification: Partial<INotification>
): Partial<INotificationEntity> => {
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
