import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";
export const createpost = async (req, res, next) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userid = req.user._id;

    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }
    if (img) {
      const uploadedresponse = await cloudinary.uploader.upload(img);
      img = uploadedresponse.secure_url;
    }
    const newpost = new Post({
      user: userid,
      text,
      img,
    });
    await newpost.save();
    res.status(201).json(newpost);
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }
    if (post.img) {
      const imgid = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgid);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const commentonpost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const postid = req.params.id;
    const userid = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = { user: userid, text };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const likeunlikepost = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userlikedpost = post.likes.includes(userid);

    if (userlikedpost) {
      // unlike it and save in db that is update the likes of post
      // const updatedpost = await Post.updateOne(
      //   { _id: postid },
      //   {
      //     $pull: {
      //       likes: userid,
      //     },
      //   },
      // );

      const updatedpost = await Post.findByIdAndUpdate(
        postid,
        { $pull: { likes: userid } },
        { new: true },
      );

      await User.updateOne(
        { _id: userid },
        {
          $pull: { likedposts: postid },
        },
      );
      const updatedLikes = updatedpost?.likes?.filter((id) => {
        return id.toString() !== userid.toString();
      });
      return res.status(200).json(updatedLikes);
    } else {
      // like the post
      // const updatedpost = await Post.updateOne(
      //   { _id: postid },
      //   {
      //     $addToSet: {
      //       likes: userid,
      //     },
      //   },
      //   { new: true },
      // );
      const updatedpost = await Post.findByIdAndUpdate(
        postid,
        { $addToSet: { likes: userid } },
        { new: true },
      );
      await User.updateOne(
        { _id: userid },
        {
          $push: { likedposts: postid },
        },
      );
      const notification = new Notification({
        from: userid,
        to: post.user,
        type: "like",
      });
      await notification.save();
      const updatedLikes = updatedpost?.likes;
      return res.status(200).json(updatedLikes);
    }
  } catch (error) {
    next(error);
  }
};

export const getallposts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getlikedposts = async (req, res, next) => {
  const userid = req.params.id;
  console.log(userid);
  try {
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.likedposts);
  } catch (error) {
    next(error);
  }
};

export const getfollowingposts = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ error: "User not found" });
    const following = user.following;

    const feedposts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(feedposts);

    console.log("running");
  } catch (error) {
    next(error);
  }
};

export const getuserposts = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
