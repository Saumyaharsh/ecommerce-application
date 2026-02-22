import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiversocketId } from "../lib/socket.js";

export const getusersforsidebar = async (req, res) => {
  try {
    // Fetch all the users but not self
    // This function is running inside middleware
    const loggedinid = req.user._id;
    const filteredusers = await User.find({ id: { $ne: loggedinid } }).select(
      "-password"
    );
    res.status(200).json(filteredusers);
  } catch (e) {
    console.log("Error in message controller getusersforsidebar");
    res.status(500).json({
      message: `Error: ${e}`,
    });
  }
};
export const getmessages = async (req, res) => {
  // Fetching messages between two people one of us should be us
  // Running inside middleware
  try {
    const myid = req.user._id;
    const { id: usertochatid } = req.params;
    const messagesbetween = await Message.find({
      $or: [
        { senderid: myid, receiverid: usertochatid },
        { senderid: usertochatid, receiverid: myid },
      ],
    });
    res.status(200).json(messagesbetween);
  } catch (e) {
    console.log("Errors in getmessages message controller");
    res.status(500).json({
      message: `Error : ${e}`,
    });
  }
};

export const sendmessage = async (req, res) => {
  try {
    const { id: recieverid } = req.params;
    const myid = req.user._id;
    const { text, image } = req.body;
    let imageurl;
    if (image) {
      //Upload image to cloudinary
      const uploadedresponse = await cloudinary.uploader.upload(image);
      imageurl = uploadedresponse.secure_url;
    }
    const newmessage = new Message({
      senderid: myid,
      recieverid,
      text,
      image: imageurl,
    });
    await newmessage.save();
    //todo: adding realtime feature
    const receiverSocketId = getreceiversocketId(recieverid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newmessage", newmessage);
    }

    res.status(200).json(newmessage);
  } catch (e) {
    res.status(500).json({
      message: `Error: ${e}`,
    });
  }
};
