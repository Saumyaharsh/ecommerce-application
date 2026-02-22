import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectroutes = async (req, res, next) => {
  try {
    // getting data from cookie
    const token = req.cookies.jwt;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const id = data.userid;
    const user = await User.findById(id).select("-password");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default protectroutes;
