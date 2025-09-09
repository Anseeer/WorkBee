import { Schema, model } from "mongoose";
import { IChat } from "./IChat";

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        participantId: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "participants.participantModel"
        },
        participantModel: {
          type: String,
          required: true,
          enum: ["User", "Worker"],
        },
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

const Chat = model<IChat>('Chat', ChatSchema);
export default Chat;
