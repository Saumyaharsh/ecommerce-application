import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email && !password) || (email && !password) || (!email && password)) {
      return res.status(400).json({ message: "Please enter full details" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // Using compare
    const val = await bcrypt.compare(password, user.password);
    if (!val) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    if (val) {
      generateToken(user._id, res);
      return res.status(200).json({
        _id: user._id,
        fullname: user.fullname,
        password,
        email,
        profilepic: user.profilepic,
      });
    }
  } catch (e) {
    res.status(500).json({ message: `Error occurred : ${e}` });
  }
};
export const signup = async (req, res) => {
  const { fullname, email, password } = await req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullname, email, password: hashedPassword });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log("Error in signup controller", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (e) {
    console.log("Error in logout controller");
    res.status(500).json({ message: `Error message : ${e}` });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;
    if (!profilepic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    // uploading profile-pic to cloudinary
    const uploadedresponse = await cloudinary.uploader.upload(profilepic);
    // Now update the database
    const updateuser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadedresponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateuser);
  } catch (e) {
    res.status(500).json({
      message: `Error : ${e}`,
    });
  }
};

export const checkauth = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (e) {
    console.log("Error in checkauth controller");
    res.status(500).json({
      message: `Error: ${e}`,
    });
  }
};
