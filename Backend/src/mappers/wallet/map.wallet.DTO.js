"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWalletToEntity = exports.mapWalletToDTO = void 0;
const mongoose_1 = require("mongoose");
const mapWalletToDTO = (wallet) => {
    return {
        _id: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt
    };
};
exports.mapWalletToDTO = mapWalletToDTO;
const mapWalletToEntity = (wallet) => {
    return {
        userId: new mongoose_1.Types.ObjectId(wallet.userId),
        balance: Number(wallet.balance),
        transactions: wallet.transactions ?? [],
        createdAt: wallet.createdAt
    };
};
exports.mapWalletToEntity = mapWalletToEntity;
