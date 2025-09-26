import { Types } from "mongoose";
import { Role } from "../../constants/role";

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
        participantModel: Role.USER | Role.WORKER;
    }[];
    isGroup?: boolean;
    lastMessage?: Types.ObjectId;
    unreadCounts?: Map<string, number>;
}
