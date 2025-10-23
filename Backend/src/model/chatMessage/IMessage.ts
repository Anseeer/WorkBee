import { Document, Types } from "mongoose"

export interface IMessage extends Document {
    chatId: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    contentType: string;
    createdAt: Date;
}