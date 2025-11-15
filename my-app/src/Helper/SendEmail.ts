import "server-only";

import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/Apiresponse";
import { renderVerificationEmail } from "@/lib/render-email";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render React Email safely (no JSX here)
    const emailHtml = await renderVerificationEmail(username, verifyCode);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: email,
      subject: "Mystery Message Verification Code",
      html: emailHtml,
    });

    return { success: true, message: "Verification email sent successfully!" };
  } catch (err) {
    console.error("Email sending failed:", err);
    return { success: false, message: "Failed to send verification email" };
  }
}
