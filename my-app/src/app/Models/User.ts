import mongoose, { Schema, Document } from "mongoose";

/* Message types + schema */
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

/* User types + schema */
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifycode?: string;
  verifycodeexpiry?: Date;
  isAcceptingMessage: boolean;
  messages: Message[]; // use plural to reflect array
}

const UserSchema: Schema<User> = new Schema({
  username: { type: String, trim: true, required: true, unique: true },

  email: {
    type: String,
    required: true,
    unique: true,
    // match expects a RegExp (optionally with an error message).
    // This is a simple email regex — replace with stricter one if needed.
    match: [/^\S+@\S+\.\S+$/, "please enter a valid email"],
  },

  password: { type: String, required: [true, "password is required"] },

  verifycode: { type: String }, // you were missing this field in the schema

  verifycodeexpiry: {
    type: Date,
    // make required only if you really need it; left optional above
  },

  isAcceptingMessage: { type: Boolean, default: true },

  // for subdocuments use type: [MessageSchema] and a default empty array
  messages: { type: [MessageSchema], default: [] },
});

/* Create / reuse model (prevents OverwriteModelError in hot-reload dev setups) */
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
