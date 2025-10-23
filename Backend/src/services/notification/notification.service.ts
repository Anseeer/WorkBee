import { inject } from "inversify";
import { INotificationRepository } from "../../repositories/notification/notification.repo.interface";
import { INotificationService } from "./notification.service.interface";
import TYPES from "../../inversify/inversify.types";
import { INotification } from "../../model/notification/notification.interface";
import { mapNotificationToEntity } from "../../mappers/notification/mapNotificationToEntity";
import { USERS_MESSAGE } from "../../constants/messages";
import logger from "../../utilities/logger";
import { INotificationDTO } from "../../mappers/notification/INotification.DTO";
import { mapNotificationToDTO } from "../../mappers/notification/mapNotificationToDTO";


export class NotificationServices implements INotificationService {
    private _notificationRepository: INotificationRepository;
    constructor(@inject(TYPES.notificationRepository) notificationRepo: INotificationRepository) {
        this._notificationRepository = notificationRepo;
    }

    async create(notification: Partial<INotification>): Promise<INotificationDTO | null> {
        try {
            if (!notification) {
                throw new Error("Notification not received");
            }
            const notificationData = mapNotificationToEntity(notification);
            const res = await this._notificationRepository.create(notificationData);
            return res ? mapNotificationToDTO(res as INotification) : null;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async getUserNotification(userId: string): Promise<INotificationDTO[] | null> {
        try {
            if (!userId) {
                throw new Error(USERS_MESSAGE.USER_ID_NOT_GET);
            }
            const res = await this._notificationRepository.getUserNotification(userId);
            return res ? res?.map((not) => mapNotificationToDTO(not)) : null;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

}