import mongoose from "mongoose";
const userschema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    imageurl: {
      type: String,
      required: true,
    },
    clerkid: {
      type: String,
      required: true,
      uniqued: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userschema);
export default User;
