import mongoose from "mongoose";
import User from "./user.model.js";
const couponschema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountpercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationdate: {
      type: Date,
      required: true,
    },
    isactive: {
      type: Boolean,
      default: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponschema);
export default Coupon;
