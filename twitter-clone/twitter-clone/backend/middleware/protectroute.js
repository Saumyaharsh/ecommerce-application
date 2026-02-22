// If person is in cookie session it can do works
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectroutes = async (req, res, next) => {
  try {
    // checking for in session and getting user id from session
    const token = req.cookies.jwt;
    if (!token) {
      next(res.status(401).json({ error: "Not authorized" }));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userid).select("-password");
    req.user = user;
    console.log(user);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
