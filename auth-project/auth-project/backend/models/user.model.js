import mongoose, { mongo } from "mongoose";
const userschema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    resetpasswordtoken: String,
    resetpasswordexpiresat: Date,
    verificationtoken: String,
    verificationtokenexpiresat: Date,
  },
  { timestamps: true }
);
const User = mongoose.model("User", userschema);
export default User;
