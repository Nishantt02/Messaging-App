
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '../../../../models/User';

// for the nextauth you must have folder structure /api/auth/[..nextauth]  and create the two files in it option.ts and route.ts
// it is the most complex for the authroziation require both email and password 
// this is the basic code for the custom method
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // authrize function for the authorization
      // this method  will return the user from the database 
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          // if the user is not there
          if (!user) {
            throw new Error('No user found with this email');
          }
          // if the user is not verified
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          // compare the password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // if the password is corrected else not corrected 
          if (isPasswordCorrect) {
            return user;
          } 
          else 
            {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],

// user come from above method so we have token and user data in jwt
// token contain all the data so instead of fecting data from db get the data from the token
  callbacks: {
    async jwt({ token, user }) {
      // get the data from the user into the token 
      // store data from the user into the token 
      if (user) // check if user exist
        {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // get the data from the token into the session and exposes it to the frontend 
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  // in this we have the session which is jwt based not database based means it will take the data from the jwt and export to the frontend
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};