import { IMessage } from "../../model/chatMessage/IMessage";
import { Iwrite } from "../base/base.repo.interface";

export interface IMessageRepository extends Iwrite<IMessage> {
    findLastMessage(chatId: string): Promise<IMessage[] | null>;
}