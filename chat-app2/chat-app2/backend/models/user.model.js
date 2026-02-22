import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  profilepic: {
    type: String,
    deault: "",
  },
});
const User = mongoose.model("User", userschema);
export default User;
