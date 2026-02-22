import User from "../models/user.model.js";
export const getallusers = async (req, res, next) => {
  try {
    const user = req.auth.userId;
    const usersleft = await User.find({
      clerkid: { $ne: user },
    });
    if (!usersleft) {
      next(res.status(400).json("User not found"));
    }
    res.status(200).json(usersleft);
  } catch (error) {
    next(error);
  }
};
