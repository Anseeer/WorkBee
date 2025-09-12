"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailService = async (email, otp) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_EMAIL,
            pass: process.env.NODE_EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.NODE_EMAIL,
        to: email,
        subject: '🔐 WorkBee - Your OTP Code for Password Reset',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2e7d32;">WorkBee</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Use the OTP below to proceed:</p>
      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #2e7d32;">
        ${otp}
      </div>
      <p>This OTP is valid for <strong>1 minute</strong>.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br/>
      <p>Thanks,<br/>The WorkBee Team</p>
    </div>
  `
    };
    await transporter.sendMail(mailOptions);
};
exports.emailService = emailService;
