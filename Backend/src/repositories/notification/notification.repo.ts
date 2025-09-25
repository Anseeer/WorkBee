import { injectable } from "inversify";
import { INotification } from "../../model/notification/notification.interface";
import Notification from "../../model/notification/notification.model";
import BaseRepository from "../base/base.repo";
import { INotificationRepository } from "./notification.repo.interface";

@injectable()
export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(Notification);
    }

    getUserNotification(userId: string): Promise<INotification[] | null> {
        const notification = Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate("actor", "name location");
        return notification;
    }

}