"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.locationSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
});
