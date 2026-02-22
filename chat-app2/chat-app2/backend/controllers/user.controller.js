import User from "../models/user.model.js";
export const getuserforuser = async (req, res) => {
  try {
    const loggedid = req.user._id;
    const users = await User.find({
      _id: { $ne: loggedid },
    }).select("-password");
    if (!users) {
      return res.status(404).json({ message: "Other users not found" });
    }
    return res.status(200).json(users);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
