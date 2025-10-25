
// // POST /api/register
// export async function POST(request: Request) {
//   await dbconnect(); // connect to MongoDB before queries        

//   try {
//     // 1. Parse request body
//     const { username, email, password } = await request.json();

//     if (!username || !email || !password) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // 2. Generate a 6-digit verification code & expiry time (1 hour)
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const verifyExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//     // 3. Check if username already exists & verified
//     const existingVerifiedUsername = await UserModel.findOne({
//       username,
//       isVerified: true,
//     });
//     if (existingVerifiedUsername) {
//       return NextResponse.json(
//         { success: false, message: "Username already taken" },
//         { status: 409 }
//       );
//     }

//     // 4. Check if email exists
//     const existingByEmail = await UserModel.findOne({ email });

//     // let userToSendEmail;

//     if (existingByEmail) {
//       if (existingByEmail.) {
//         // Already registered & verified return error
//         return NextResponse.json(
//           { success: false, message: "Email already registered" },
//           { status: 409 }
//         );
//       } 
//       else {
//         // Email exists but not verified → update with new password + code
//         const hashedPassword = await bcrypt.hash(password, 10);
//         existingByEmail.password = hashedPassword;
//         existingByEmail.verifycode = verifyCode;
//         existingByEmail.verifycodeexpiry = verifyExpiry;
//         await existingByEmail.save();
//         userToSendEmail = existingByEmail;
//       }
//     } else {
//       // 5. Create a new unverified user
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newUser = new UserModel({
//         username,
//         email,
//         password: hashedPassword,
//         verifycode: verifyCode,
//         verifycodeexpiry: verifyExpiry,
//         isAcceptingMessage: true,
//         messages: [],
//         isVerified: false,
//       });

//       await newUser.save();
//       userToSendEmail = newUser;
//     }

//     // 6. Send verification email
//     try {
//       const emailResponse = await sendVerificationEmail(
//         userToSendEmail.email,
//         userToSendEmail.username,
//         verifyCode
//       );

//       if (!emailResponse?.success) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: emailResponse?.message || "Failed to send verification email",
//           },
//           { status: 500 }
//         );
//       }
//     } catch (err) {
//       console.error("Email sending error:", err);
//       return NextResponse.json(
//         { success: false, message: "Failed to send verification email" },
//         { status: 500 }
//       );
//     }

//     // 7. Final response
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Verification code sent to your email",
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error registering user:", error);
//     return NextResponse.json(
//       { success: false, message: "Error registering user" },
//       { status: 500 }
//     );
//   }
// }

// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import bcrypt from 'bcryptjs';
// import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Lib/Models/User";
import bcrypt from "bcryptjs"; 
import { sendVerificationEmail } from "@/Helper/SendEmail";
import { NextResponse } from "next/server"; // correct way to send response in Next.js app router


export async function POST(request: Request) {
  await dbconnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
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