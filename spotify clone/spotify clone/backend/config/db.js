import mongoose from "mongoose";
const connectdb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/spotify-clone-api");
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Error in db connection", error);
  }
};
export default connectdb;
