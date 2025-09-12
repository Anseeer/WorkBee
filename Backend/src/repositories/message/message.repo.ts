import { injectable } from "inversify";
import { CHAT_MESSAGE } from "../../constants/messages";
import { IMessage } from "../../model/chatMessage/IMessage";
import Message from "../../model/chatMessage/message.model";
import BaseRepository from "../base/base.repo";
import { IMessageRepository } from "./message.repo.interface";

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {

    constructor() {
        super(Message);
    }
    async findLastMessage(chatId: string): Promise<IMessage[] | null> {
        try {
            if (!chatId) {
                throw new Error(CHAT_MESSAGE.CHAT_ID_NOT_GET);
            }

            return await this.model.find({ chatId })
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
        } catch (error) {
            console.error('Error in findLastMessage:', error);
            throw new Error('Error in findLastMessage');
        }
    }


}