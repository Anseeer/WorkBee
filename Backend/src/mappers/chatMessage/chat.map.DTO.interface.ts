import { Types } from "mongoose";

export interface IChatDTO {
    _id: string;
    participants: {
        _id: Types.ObjectId;
        name: string,
        profileImage: string
    }[];
    isGroup: boolean;
    lastMessage?: Types.ObjectId;
    unreadCounts: Map<string, number>;
}

export interface IChatEntity {
    participants: {
        participantId: Types.ObjectId;
        participantModel: "User" | "Worker";
    }[];
    isGroup?: boolean;
    lastMessage?: Types.ObjectId;
    unreadCounts?: Map<string, number>;
}
