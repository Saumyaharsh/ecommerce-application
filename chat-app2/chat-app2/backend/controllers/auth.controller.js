import User from "../models/user.model.js";
import generatecookieandtoken from "../utils/generatetoken.js";
import bcrypt from "bcryptjs";
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const ispassword = await bcrypt.compare(
      password,
      !user ? "" : user.password
    );
    if (!user || !ispassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    generatecookieandtoken(user._id, res);
    return res.status(200).json({
      fullname: user.fullname,
      username,
      profilepic: user.profilepic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmpassword, gender } = req.body;
    if (password !== confirmpassword) {
      return res.status(401).json({ error: "Not correct password" });
    }
    // using mongodb query to fetch result
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exist" });
    }
    const imageurl = `https://avatar.iran.liara.run/username?username=${fullname}`;
    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const newuser = new User({
      fullname,
      username,
      password: hashedpassword,
      gender,
      profilepic: imageurl,
    });
    if (newuser) {
      generatecookieandtoken(newuser._id, res);
      await newuser.save();
    }
    return res.status(201).json({
      _id: newuser._id,
      fullname: newuser.fullname,
      username: newuser.username,
      profilepic: newuser.profilepic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
