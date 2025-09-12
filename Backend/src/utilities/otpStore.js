"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOtp = exports.getOtp = exports.saveOtp = void 0;
const otpMap = new Map();
const saveOtp = (email, otp, ttl = 600000) => {
    const expiresAt = Date.now() + ttl;
    otpMap.set(email, { otp, expiresAt });
};
exports.saveOtp = saveOtp;
const getOtp = (email) => {
    return otpMap.get(email);
};
exports.getOtp = getOtp;
const deleteOtp = (email) => {
    otpMap.delete(email);
};
exports.deleteOtp = deleteOtp;
