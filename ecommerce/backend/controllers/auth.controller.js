import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

const generatetokens = (userid) => {
  const accesstoken = jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshtoken = jwt.sign({ userid }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accesstoken, refreshtoken };
};
const store_refresh_token = async (userid, refreshtoken) => {
  await redis.set(
    `refresh_token:${userid}`,
    refreshtoken,
    "EX",
    7 * 24 * 60 * 60,
  ); // in seconds
};
const setCookies = (res, accesstoken, refreshtoken) => {
  // wrong practise setting accesstoken in cookie - security risk
  res.cookie("accesstoken", accesstoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userexists = await User.findOne({ email });
    if (userexists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // user got created and saved
    const user = await User.create({ name, email, password });

    //authenticate
    const { accesstoken, refreshtoken } = generatetokens(user._id);
    await store_refresh_token(user._id, refreshtoken);

    setCookies(res, accesstoken, refreshtoken);

    user.password = "";
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshtoken;
    if (refreshtoken) {
      const decoded = jwt.verify(
        refreshtoken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_token:${decoded.userid}`);
    }
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accesstoken, refreshtoken } = generatetokens(user._id);
      await store_refresh_token(user._id, refreshtoken);

      setCookies(res, accesstoken, refreshtoken);
      user.password = undefined;
      res.status(200).json(user);
    }
    // } else if (!user) {
    //   res.status(400).json({ message: "User does not exist" });
    // }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const refreshtoken = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshtoken;
    if (!refreshtoken) {
      return res.status(401).json({ messge: "Unauthorizd" });
    }
    const decoded = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    const storedtoken = await redis.get(`refresh_token:${decoded.userid}`);
    if (storedtoken !== refreshtoken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accesstoken = jwt.sign(
      { userid: decoded.userid },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refresh successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getprofile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
