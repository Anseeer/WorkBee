import { injectable } from "inversify";
import { INotification } from "../../model/notification/notification.interface";
import Notification from "../../model/notification/notification.model";
import BaseRepository from "../base/base.repo";
import { INotificationRepository } from "./notification.repo.interface";
import logger from "../../utilities/logger";

@injectable()
export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(Notification);
    }

    async getUserNotification(userId: string): Promise<INotification[] | null> {
        try {
            const notification = await this.model.find({ recipient: userId })
                .sort({ createdAt: -1 })
                .populate("actor", "name location");
            return notification;
        } catch (error) {
            logger.error('Error in getUserNotification:', error);
            throw new Error('Error in getUserNotification');
        }
    }

    async clearNotification(userId: string): Promise<void> {
        try {
            await this.model.deleteMany({ recipient: userId });
        } catch (error) {
            logger.error('Error in clearNotification:', error);
            throw new Error('Error in clearNotification');
        }
    }

}