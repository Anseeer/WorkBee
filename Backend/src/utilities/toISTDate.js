"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toISTDateOnly = toISTDateOnly;
function toISTDateOnly(d) {
    return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
