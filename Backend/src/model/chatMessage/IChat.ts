import { Document, Types } from "mongoose";

export interface IParticipant {
    participantId: Types.ObjectId | {
        _id?: Types.ObjectId;
        name?: string;
        profileImage?: string;
    };
    participantModel: string;
    _id?: Types.ObjectId;
}

export interface IChat extends Document {
    _id: string;
    participants: IParticipant[];
    isGroup: boolean;
    lastMessage?: Types.ObjectId;
    unreadCounts: Map<string, number>;
    createdAt?: Date;
    updatedAt?: Date;
}