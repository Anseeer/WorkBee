"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = generateTransactionId;
async function generateTransactionId(paymentId) {
    return `TXN-${paymentId}-${Date.now()}`;
}
