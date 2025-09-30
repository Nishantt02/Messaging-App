// app/api/register/route.ts   (example location for Next.js 13+ app router)

import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Models/User";
import bcrypt from "bcryptjs"; // ✅ fixed typo (was 'bcrypt js')
import { sendVerificationEmail } from "@/Helper/SendEmail";
import { NextResponse } from "next/server"; // ✅ correct way to send response in Next.js app router

// POST /api/register
export async function POST(request: Request) {
  await dbconnect(); // ✅ connect to MongoDB before queries        

  try {
    // 1. Parse request body
    const { username, email, password } = await request.json();

    

    // 3. Generate a 6-digit verification code & expiry time (1 hour)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 4. Check if username already exists & verified
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 409 }
      );
    }

    // 5. Check if email exists
    const existingByEmail = await UserModel.findOne({ email });

    if (existingByEmail) {
      if (existingByEmail.isVerified) {
        // Already registered & verified
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 409 }
        );
      } else {
        // Email exists but not verified → update with new password + code
        const hashedPassword = await bcrypt.hash(password, 10);
        existingByEmail.password = hashedPassword;
        existingByEmail.verifycode = verifyCode;
        existingByEmail.verifycodeexpiry = verifyExpiry;
        await existingByEmail.save();
      }
    } else {
      // 6. Create a new unverified user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifycode: verifyCode,
        verifycodeexpiry: verifyExpiry,
        isAcceptingMessage: true,
        messages: [],
        isVerified: false,
      });

      await newUser.save();
    }

    // 7. Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);

    // if not able to send the response.
    if (!emailResponse?.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse?.message || "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    // 8. Final response
    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
