import mongoose, { Schema } from 'mongoose';
import { IMessage } from './message.interface.model';

const MessageSchema: Schema = new Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    room: { type: String, required: true },
});

export default mongoose.model<IMessage>('Message', MessageSchema);