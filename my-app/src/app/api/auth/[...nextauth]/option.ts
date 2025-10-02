import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/Models/User";
import dbconnect from "@/Lib/dbconnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials", 
      name: "Credentials",
      credentials: {
        username: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials: any): Promise<any> {
        // 1. Connect to database
        await dbconnect();


        try {
          // 2. Find user by email OR username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.username },
              { username: credentials.username },
            ],
          });

          if (!user) {
            throw new Error("User not found with this email or username");
          }

          // 3. Check if user is verified
          if (!user.isVerified) {
            throw new Error("Verify your account before logging in");
          }

          // 4. Compare entered password with hashed password in DB
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          // 5. Return user object → will be saved in JWT/session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
          };
        } catch (err: any) {
          // Any error → login fails
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],
  
//nextauth provides the hooks what data is goes in token and what data is goes in session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  // runs where the usesession() is called

  pages: {
    signIn: "/sign-in", // custom login page
  },
  session:{
    strategy:"jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
