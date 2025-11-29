/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "../../constants/role";
import { IChat } from "../../model/chatMessage/IChat";
import { IChatDTO, IChatEntity } from "./chat.map.DTO.interface";
import { Types } from "mongoose";

export const mapChatToDTO = (chat: IChat): IChatDTO => {
    if (!chat || !chat.participants) {
        throw new Error("Chat or participants missing");
    }

    const otherParticipants = chat.participants
        .filter(p => p && p.participantId)  
        .map(p => {
            const participant = p.participantId as any;

            return {
                _id: participant._id?.toString() ?? "",
                name: participant.name ?? "Unknown",
                profileImage: participant.profileImage ?? "",
                model: p.participantModel
            };
        });

    return {
        _id: chat._id?.toString() ?? "",
        participants: otherParticipants,
        lastMessage: chat.lastMessage,
        unreadCounts: chat.unreadCounts as Map<string, number>,
        isGroup: chat.isGroup,
    };
};


export const mapChatToEntity = (chat: Partial<IChat>): IChatEntity => {
    return {
        participants: (chat.participants ?? []).map(p => ({
            participantId: new Types.ObjectId(p.participantId.toString()),
            participantModel: p.participantModel as Role.USER | Role.WORKER
        })),
        lastMessage: chat.lastMessage ?? undefined,
        unreadCounts: chat.unreadCounts ?? new Map<string, number>(),
        isGroup: chat.isGroup ?? false,
    };
};
