export interface INotificationEntity {
    recipient: string;
    recipientModel: string;
    actor?: string;
    actorModel?: string;
    title: string;
    type: string;
    body: string;
    read: boolean;
    createdAt: Date;
}
