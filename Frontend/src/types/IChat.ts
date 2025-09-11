import type { IChatMessage } from "./IChatMessage";

export interface IChat {
    _id: string;
    lastMessage: IChatMessage;
    participants: {
        _id: string,
        name: string,
        model: string,
        profileImage: string,
    }[],
    unreadCounts: { [userId: string]: number },
}