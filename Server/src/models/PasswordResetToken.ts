import mongoose, { Schema } from "mongoose";

export interface PasswordResetTokensDocument extends mongoose.Document {
  userId: string;
  token: string;
  expiryDate: Date;
}

const passwordResetTokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    require: true,
  },
  expiryDate: {
    type: Date,
  },
});

export const PasswordResetToken = mongoose.model<PasswordResetTokensDocument>(
  "PasswordResetToken",
  passwordResetTokenSchema
);
