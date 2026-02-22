import mongoose from "mongoose";
const connectdb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/twitter-clone-api");
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
  }
};
export default connectdb;
