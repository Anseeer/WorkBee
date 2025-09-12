import { injectable } from "inversify";
import { IChatRepositoy } from "./chat.repo.interface";
import { IChat } from "../../model/chatMessage/IChat";
import BaseRepository from "../base/base.repo";
import Chat from "../../model/chatMessage/chat.model";
import { Types } from "mongoose";
import { CHAT_MESSAGE } from "../../constants/messages";

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepositoy {
    constructor() {
        super(Chat)
    }

    async findChat(participants: string[]): Promise<IChat[] | null> {
        try {
            if (!participants || participants.length < 2) {
                throw new Error("Participants must contain at least 2 users!");
            }

            const chat = await this.model.find({
                "participants.participantId": {
                    $all: participants.map(id => new Types.ObjectId(id))
                }
            });

            return chat.length > 0 ? chat : null;
        } catch (error) {
            console.error('Error in findChat:', error);
            throw new Error('Error in findChat');
        }
    }

    async findChatByUsers(userId: string): Promise<IChat[]> {
        try {
            if (!userId) {
                throw new Error("userId is required!");
            }

            return await this.model.find({
                "participants.participantId": userId
            })
                .populate("participants.participantId", "name profileImage")
                .populate("lastMessage");
        } catch (error) {
            console.error('Error in findChatByUsers:', error);
            throw new Error('Error in findChatByUsers');
        }
    }

    async findByChatId(chatId: string): Promise<IChat | null> {
        try {
            if (!chatId) {
                throw new Error(CHAT_MESSAGE.CHAT_ID_NOT_GET);
            }

            return await this.model.findById(chatId).populate('lastMessage');
        } catch (error) {
            console.error('Error in findByChatId:', error);
            throw new Error('Error in findByChatId');
        }
    }

    async updateChatOnSendMessage(
        chatId: string,
        receiverId: string,
        messageId: string,
        receiverViewing: boolean
    ): Promise<void> {
        try {
            if (!chatId || !receiverId || !messageId) {
                throw new Error("Cant get chatId or receiverId or messageId");
            }

            const value = receiverViewing ? 0 : 1;

            await this.model.updateOne(
                { _id: chatId },
                {
                    $set: { lastMessage: messageId },
                    $inc: { [`unreadCounts.${receiverId}`]: value },
                }
            );
        } catch (error) {
            console.error('Error in updateChatOnSendMessage:', error);
            throw new Error('Error in updateChatOnMessage');
        }
    }

    async resetUnreadCount(chatId: string, userId: string): Promise<boolean> {
        try {
            if (!chatId || !userId) {
                throw new Error("chatId or userId not provided!");
            }

            console.log("ChatId :", chatId);
            console.log("UserId :", userId);

            const result = await this.model.updateOne(
                { _id: new Types.ObjectId(chatId) },
                { $set: { [`unreadCounts.${userId}`]: 0 } }
            );

            console.log("Modified Count:", result.modifiedCount);

            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error in resetUnreadCount:', error);
            throw new Error('Error in resetUnreadCount');
        }
    }


}