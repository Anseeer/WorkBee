"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const location_model_1 = require("../location/location.model");
const workerSchema = new mongoose_1.Schema({
    // registration
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: location_model_1.locationSchema,
        required: true
    },
    categories: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Category',
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    services: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Services',
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    completedWorks: {
        type: Number,
        required: false,
        default: 0
    },
    radius: {
        type: Number,
        required: false
    },
    workType: {
        type: [String],
        enum: ['one-time', 'weekly', 'monthly', 'long-term'],
        required: false
    },
    preferredSchedule: {
        type: [String],
        enum: ['morning', 'afternoon', 'evening', 'night', 'full-day'],
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: "Worker"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending Approval", "Approved", "Rejected"],
        default: "Pending Approval",
    },
    govId: {
        type: [String],
        required: false
    },
    subscription: {
        plan: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Subscription', required: false },
        startDate: { type: Date, required: false },
        endDate: { type: Date, required: false },
        isActive: { type: Boolean, default: false }
    },
    isAccountBuilt: { type: Boolean, default: false }
}, { timestamps: true });
const Worker = mongoose_1.default.model('Worker', workerSchema);
exports.default = Worker;
