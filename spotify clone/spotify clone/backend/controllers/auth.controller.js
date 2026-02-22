import User from "../models/user.model.js";
export const authcallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // checking if user already exist
    const user = await User.findOne({ clerkid: id });
    if (!user) {
      const newuser = await User.create({
        clerkid: id,
        imageurl: imageUrl,
        fullname: `${firstName} ${lastName}`,
      });

      return res.status(201).json(newuser);
    }
    res.status(200).json({ message: "User already exists" });
  } catch (error) {
    console.log("error in authcontroller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
