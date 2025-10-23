import { INotificationDTO } from "../../mappers/notification/INotification.DTO";
import { INotification } from "../../model/notification/notification.interface";

export interface INotificationService {
    create(notification: Partial<INotification>): Promise<INotificationDTO | null>;
    getUserNotification(userId: string): Promise<INotificationDTO[] | null>;
}