import { Schema } from 'mongoose';

export const LocationSchema = new Schema(
  {
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
);
