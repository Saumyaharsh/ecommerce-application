import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
export const protectroute = async (req, res, next) => {
  try {
    // verifying user
    const accesstoken = req.cookies.accesstoken;
    if (!accesstoken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // decode the token to get userid
    const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
    const userid = decoded.userid;
    // finding the user
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const adminroute = async (req, res, next) => {
  try {
    // we are getting user from req.user since protectroute is running before admin route
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        message: "User is not admin",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
