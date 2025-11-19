import { INotification } from "../../model/notification/notification.interface";

export interface INotificationRepository {
    create(category: Partial<INotification>): Promise<INotification | null>;
    getUserNotification(userId: string): Promise<INotification[] | null>;
    clearNotification(userId: string): Promise<void>;
}