import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generatetokenandsetcookie from "../lib/generatetoken.js";

// connected to backend
export const signup = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;
    // username and email are unique
    console.log(req.body);
    // validating email
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailregex.test(email)) {
      return res.status(400).json({ error: "Email is not correct" });
    }
    // checking if user exists
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "email exists" });
    }
    // checking if usename already exists
    const userfinding = await User.findOne({ username: username });
    if (userfinding) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser = new User({
      fullname,
      email,
      username,
      password: hashedpassword,
    });
    if (newuser) {
      await newuser.save();
      generatetokenandsetcookie(newuser._id, res);

      newuser.password = undefined;
      return res.status(201).json(newuser);
    } else {
      return res.status(400).json({ error: "User not created" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      next(res.status(400).json({ error: "Enter fields" }));
    }

    // since username is unique
    const user = await User.findOne({ username });

    // verifying password
    const ispassword = await bcrypt.compare(
      password,
      user ? user.password : " ",
    );
    if (!user || !ispassword) {
      next(res.status(400).json({ error: "username or password incorrect" }));
    }
    generatetokenandsetcookie(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // deleting cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getme = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(201).json(user);
    console.log(req.body);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
