import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getsocketid } from "../socket/socket.js";
import { io } from "../socket/socket.js";
export const sendmessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverid = req.params.id;
    const senderid = req.user._id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderid, receiverid] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderid, receiverid],
      });
    }
    const newmessage = new Message({
      senderid,
      receiverid,
      messages: message,
    });

    if (newmessage) {
      conversation.messages.push(newmessage._id);
    }
    await Promise.all([newmessage.save(), conversation.save()]);
    // All messages are saved to db
    const socketid = getsocketid(receiverid);
    if (socketid) {
      // newmessage
      io.to(socketid).emit("newmessage", newmessage); // CHECK HERE WHILE CONNECTING
    }

    res.status(201).json(newmessage);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};
export const getmessage = async (req, res) => {
  try {
    const senderid = req.user._id;
    const usertochatid = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderid, usertochatid] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json({ message: "no conversation made" });
    }
    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.log(`${error} in getmessage controller`);
    res.status(500).json({ error: "Internal server error" });
  }
};
// socket io implementation necessary
