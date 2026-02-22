import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectroutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Authorization error" });
    }
    //Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorised access" });
    }
    //Finding the user , token has some data
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log("Error in productroutes");
    res.status(500).json({ message: `Error : ${e}` });
  }
};
