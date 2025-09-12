"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    participants: [
        {
            participantId: {
                type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Message",
    },
    unreadCounts: {
        type: Map,
        of: Number,
        default: {},
    },
}, { timestamps: true });
const Chat = (0, mongoose_1.model)('Chat', ChatSchema);
exports.default = Chat;
