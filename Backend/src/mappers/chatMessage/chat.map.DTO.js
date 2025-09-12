"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapChatToEntity = exports.mapChatToDTO = void 0;
const mongoose_1 = require("mongoose");
const mapChatToDTO = (chat) => {
    const otherParticipants = chat.participants
        .map(p => {
        const participant = p.participantId;
        return {
            _id: participant._id,
            name: participant.name,
            profileImage: participant.profileImage,
            model: p.participantModel
        };
    });
    return {
        _id: chat._id?.toString(),
        participants: otherParticipants,
        lastMessage: chat.lastMessage,
        unreadCounts: chat.unreadCounts,
        isGroup: chat.isGroup,
    };
};
exports.mapChatToDTO = mapChatToDTO;
const mapChatToEntity = (chat) => {
    return {
        participants: (chat.participants ?? []).map(p => ({
            participantId: new mongoose_1.Types.ObjectId(p.participantId.toString()),
            participantModel: p.participantModel
        })),
        lastMessage: chat.lastMessage ?? undefined,
        unreadCounts: chat.unreadCounts ?? new Map(),
        isGroup: chat.isGroup ?? false,
    };
};
exports.mapChatToEntity = mapChatToEntity;
