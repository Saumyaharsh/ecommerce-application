import mongoose from "mongoose";
import User from "./user.model.js";
const orderschema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalamount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripesessionid: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderschema);
export default Order;
