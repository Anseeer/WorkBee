import { IMessage } from "../../model/chatMessage/IMessage";
import { IMessageDTO, IMessageEntity } from "./message.map.DTO.interface";

export const mapMessageToDTO = (message: IMessage): IMessageDTO => {
    return {
        id:message.id,
        chatId: message.chatId,
        senderId: message.senderId.toString(),
        receiverId: message.receiverId.toString(),
        content: message.content,
        contentType: message.contentType
    }
}

export const mapMessageToEntity = (message: IMessage): IMessageEntity => {
    return {
        chatId: message.chatId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        contentType: message.contentType
    }
}