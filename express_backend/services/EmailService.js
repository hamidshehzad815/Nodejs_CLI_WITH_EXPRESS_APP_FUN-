import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Welcome to CLI APP",
      html: "code", //code,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("❌ Error sending welcome email:", err.message);
    return { success: false, error: err.message };
  }
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Reset token",
      html: `${resetToken}`, //code,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ reset token sent to ${email}:`);
  } catch (err) {
    console.error("❌ Error sending token email:", err.message);
    return { success: false, error: err.message };
  }
};
