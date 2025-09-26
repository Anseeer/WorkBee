import { INotification } from "../../model/notification/notification.interface";

export interface INotificationService {
    create(notification: Partial<INotification>): Promise<INotification | null>;
    getUserNotification(userId: string): Promise<INotification[] | null>;
}