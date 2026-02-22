import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/auth-api");
    console.log("DB is connected");
  } catch (error) {
    process.exit(1);
    console.log(error);
  }
};

export default connectdb;
