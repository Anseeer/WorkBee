import { Types } from "mongoose";

export interface IMessageDTO {
    id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    contentType: string
}


export interface IMessageEntity {
    chatId: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    contentType: string
}

