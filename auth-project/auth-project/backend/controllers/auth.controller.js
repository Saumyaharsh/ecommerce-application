import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateverificationtoken } from "../utils/generateverificationtoken.js";
import { generate_token_and_setcookie } from "../utils/generatetokenandsetcookie.js";
import {
  sendverificationemail,
  sendwelcomeemail,
  sendpasswordresetemail,
  sendresetsuccessemail,
} from "../utils/emails.js";

export const signup = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const useralreadyexists = await User.findOne({ email });
    if (useralreadyexists) {
      return res
        .status(500)
        .json({ success: false, message: "User already exists" });
    }
    const hashedpassword = await bcryptjs.hash(password, 10);
    const verificationtoken = generateverificationtoken();

    const user = new User({
      email,
      password: hashedpassword,
      name,
      verificationtoken,
      verificationtokenexpiresat: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();
    user.password = undefined;
    // jwt
    generate_token_and_setcookie(res, user._id);
    await sendverificationemail(user.email, verificationtoken);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyemail = async (req, res) => {
  // 1 2 3 4 5
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationtoken: code,
      verificationtokenexpiresat: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: true,
        message: "Invalid or expired verification code",
      });
    }
    user.isverified = true;
    user.verificationtoken = undefined;
    user.verificationtokenexpiresat = undefined;
    await user.save();
    await sendwelcomeemail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const ispasswordvalid = await bcryptjs.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    generate_token_and_setcookie(res, user._id);
    user.lastlogin = new Date();
    await user.save();
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resettoken = crypto.randomBytes(20).toString("hex");
    const resettokenexpiresat = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetpasswordtoken = resettoken;
    user.resetpasswordexpiresat = resettokenexpiresat;

    await user.save();

    //send email
    await sendpasswordresetemail(
      user.email,
      `http://localhost:5173/reset-password/${resettoken}`,
    );

    res.status(200).json({
      success: true,
      message: "Email reset link sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetpassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetpasswordtoken: token,
      resetpasswordexpiresat: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // update password
    const hashedpassword = await bcryptjs.hash(password, 10);

    user.password = hashedpassword;
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpiresat = undefined;
    await user.save();

    await sendresetsuccessemail(user.email);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkauth = async (req, res) => {
  try {
    const userid = req.userid;
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
