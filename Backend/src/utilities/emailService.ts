import nodemailer from 'nodemailer';

type EmailType = "RESET_PASSWORD" | "VERIFY_EMAIL";

export const emailService = async (email: string, otp: string, type: EmailType) => {
  const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.gmail.com",
    auth: {
      user: process.env.NODE_EMAIL,
      pass: process.env.NODE_EMAIL_PASS,
    },
  });

  const templates = {
    RESET_PASSWORD: {
      subject: "🔐 WorkBee - Your OTP Code for Password Reset",
      title: "Password Reset OTP",
      message: `
        <p>You requested to reset your password. Use the OTP below to continue:</p>
      `,
    },
    VERIFY_EMAIL: {
      subject: "📬 WorkBee - Verify Your Email Address",
      title: "Email Verification OTP",
      message: `
        <p>Welcome to <strong>WorkBee</strong>! Please verify your email using the OTP below:</p>
      `,
    }
  };

  const selected = templates[type];

  const mailOptions = {
    from: process.env.NODE_EMAIL,
    to: email,
    subject: selected.subject,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
      ">
        <h2 style="color: #2e7d32; margin-bottom: 10px;">WorkBee</h2>

        <h3 style="color: #333; margin-top: 0;">${selected.title}</h3>

        ${selected.message}

        <div style="
          background-color: #f0f0f0;
          padding: 15px;
          text-align: center;
          border-radius: 6px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          color: #2e7d32;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p style="margin-top: 5px;">
          This OTP is valid for <strong>1 minute</strong>.
        </p>

        <br/>

        <p>Thanks,<br/>The WorkBee Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
