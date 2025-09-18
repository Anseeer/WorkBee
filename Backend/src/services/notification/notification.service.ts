import { inject } from "inversify";
import { INotificationRepository } from "../../repositories/notification/notification.repo.interface";
import { INotificationService } from "./notification.service.interface";
import TYPES from "../../inversify/inversify.types";
import { INotification } from "../../model/notification/notification.interface";
import { mapNotificationToEntity } from "../../mappers/notification/mapNotificationToEntity";
import { USERS_MESSAGE } from "../../constants/messages";


export class NotificationServices implements INotificationService {
    private _notificationRepository: INotificationRepository;
    constructor(@inject(TYPES.notificationRepository) notificationRepo: INotificationRepository) {
        this._notificationRepository = notificationRepo;
    }

    create(notification: Partial<INotification>): Promise<INotification | null> {
        if (!notification) {
            throw new Error("Notification not get ");
        }
        const notificationData = mapNotificationToEntity(notification)
        return this._notificationRepository.create(notificationData);
    }
    getUserNotification(userId: string): Promise<INotification[] | null> {
        if (!userId) {
            throw new Error(USERS_MESSAGE.USER_ID_NOT_GET);
        }
        return this._notificationRepository.getUserNotification(userId);
    }

}