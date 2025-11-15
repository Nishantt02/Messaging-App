
import dbConnect from "@/lib/dbConnect";
import UserModel from "../../../models/User";
import bcrypt from "bcryptjs"; 
import { sendVerificationEmail } from "@/helper/SendEmail";
import { NextResponse } from "next/server"; // correct way to send response in Next.js app router


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();


    // find the user by the username it is verified
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // if the username is alreadt exsit then return false
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // find the user by mail
    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
// if the mail is exist then check it is verified or not 
    if (existingUserByEmail) 
{
  // if it is verified
      if (existingUserByEmail.isVerified)
         {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } 
      // if it is not verified
else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    }
    // create the new user if the mail is new 
 else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}

