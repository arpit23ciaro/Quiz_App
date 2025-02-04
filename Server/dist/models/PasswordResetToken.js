import mongoose, { Schema } from "mongoose";
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
export const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
