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
const workSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Worker",
        required: true,
    },
    serviceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    paymentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Payment",
    },
    service: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    workerName: {
        type: String,
        required: false,
    },
    userName: {
        type: String,
        required: false,
    },
    wage: {
        type: String,
        required: false
    },
    location: {
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    workType: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    sheduleDate: {
        type: String,
        required: true
    },
    sheduleTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Canceled", "Completed", "Rejected", "Accepted"],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Canceled", "Completed"],
        default: 'Pending'
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });
const Work = mongoose_1.default.model("Work", workSchema);
exports.default = Work;
