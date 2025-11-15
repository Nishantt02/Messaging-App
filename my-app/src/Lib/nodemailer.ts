
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail
    pass: process.env.EMAIL_PASS,      // your App password
  },
});
