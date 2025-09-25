import mongoose, { Schema } from "mongoose";
import { IMessage } from "./IMessage";

const MessageSchema = new Schema<IMessage>({
    chatId: {
        type: String,
        ref: "Chat",
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text',
    },
}, { timestamps: true });


const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;