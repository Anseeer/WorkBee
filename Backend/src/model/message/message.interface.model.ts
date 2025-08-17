import { Document } from "mongoose";

export interface IMessage extends Document {
    sender: string;
    content: string;
    timestamp: Date;
    room: string;
}