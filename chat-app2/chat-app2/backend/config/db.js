import mongoose from "mongoose";
const connectdb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chat-app-2-api");
    console.log("DB successfully connected");
  } catch (e) {
    console.log(`Error in connecting DB ${e}`);
  }
};
export default connectdb;
