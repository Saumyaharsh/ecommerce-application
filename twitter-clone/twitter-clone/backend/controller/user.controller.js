import bcrypt from "bcryptjs";

import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// this is not using middleware like express-upload or multer so image will be in base 64 format
// or sent from frontend . can't use normal google image
const fileuploader = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const addorremovefollowers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usertomodify = await User.findById(id);
    const currentuser = await User.findById(req.user._id);

    if (id === req.user._id) {
      next(
        res.status(400).json({ error: "you can't follow/unfollow yourself" })
      );
    }
    if (!usertomodify || !currentuser) {
      next(res.status(400).json({ error: "User not found" }));
    }

    const isfollowing = currentuser.following.includes(id);
    console.log(isfollowing);
    if (isfollowing) {
      // Unfollow the user
      await Promise.all([
        User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }),
        User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }),
      ]);
      return res.status(200).json({ message: "User unfoloowed successfully" });
    } else {
      //Follow the user

      await Promise.all([
        User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }),
        User.findByIdAndUpdate(req.user._id, { $push: { following: id } }),
      ]);
      // SEND NOTIFICATION TO THE USER
      const newnotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: usertomodify._id,
      });
      await newnotification.save();

      // TODO : return the id of the user as response
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    next(error);
  }
};
export const getsuggestedusers = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const userfollowedbyme = await User.findById(userid).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userid },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredusers = users.filter(
      (user) => !userfollowedbyme.following.includes(user._id)
    );
    const suggestedusers = filteredusers.slice(0, 4);
    suggestedusers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedusers);
  } catch (error) {
    next(error);
  }
};

export const getuserprofile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      next(
        res.status(404).json({
          error: "No user exists",
        })
      );
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateuser = async (req, res, next) => {
  const { fullname, email, username, currentpassword, newpassword, bio, link } =
    req.body;
  let { profileimg, coverimg } = req.body;
  const userid = req.user._id;
  try {
    let user = await User.findById(userid);
    if (!user) {
      next(res.status(404).json("User not found"));
    }
    if (
      (!newpassword && currentpassword) ||
      (!currentpassword && newpassword)
    ) {
      next(
        res
          .status(404)
          .json({ error: "Please provide current password and new password" })
      );
    }
    if (currentpassword && newpassword) {
      const ismatch = await bcrypt.compare(currentpassword, user.password);
      if (!ismatch)
        next(res.status(400).json({ error: "current password is incorrect" }));
      if (newpassword.length < 6) {
        next(
          res.status(400).json({ error: "password must be 6 characters long" })
        );
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newpassword, salt);
    }
    if (profileimg) {
      if (user.profileimg) {
        await cloudinary.uploader.destroy(
          user.profileimg.split("/").pop().split(",")[0]
        );
      }
      profileimg = fileuploader(profileimg);
    }
    if (coverimg) {
      if (user.coverimg) {
        await cloudinary.uploader.destroy(
          user.coverimg.split("/").pop().split(",")[0]
        );
      }
      coverimg = fileuploader(coverimg);
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileimg = profileimg || user.profileimg;
    user.coverimg = coverimg || user.coverimg;

    user = await user.save();

    // password should be null in response
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
