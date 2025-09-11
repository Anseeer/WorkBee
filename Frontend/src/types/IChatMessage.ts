export interface IChatMessage {
    _id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    contentType?: string;
    createdAt?: string | Date;
};