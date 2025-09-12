"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMessageToEntity = exports.mapMessageToDTO = void 0;
const mapMessageToDTO = (message) => {
    return {
        id: message.id,
        chatId: message.chatId,
        senderId: message.senderId.toString(),
        receiverId: message.receiverId.toString(),
        content: message.content,
        contentType: message.contentType
    };
};
exports.mapMessageToDTO = mapMessageToDTO;
const mapMessageToEntity = (message) => {
    return {
        chatId: message.chatId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        contentType: message.contentType
    };
};
exports.mapMessageToEntity = mapMessageToEntity;
