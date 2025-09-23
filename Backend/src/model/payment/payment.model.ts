import mongoose from "mongoose";
import { IPayment } from "./payment.interface.model";

const paymentSchema = new mongoose.Schema<IPayment>({
  workId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Work",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending"
  },
  paymentMethod: {
    type: String,
    default: null
  },
  transactionId: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });


const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;