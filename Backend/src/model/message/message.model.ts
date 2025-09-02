import mongoose, { Schema } from 'mongoose';
import { IMessage } from './message.interface.model';

const MessageSchema: Schema = new Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    room: { type: String, required: true },
    isRead: { type: Boolean, default: false }, 
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;