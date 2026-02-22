import mongoose from "mongoose";
const messageschema = mongoose.Schema(
  {
    senderid: {
      // clerk id
      type: String,
      required: true,
    },
    receiverid: {
      // clerk id
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageschema);
export default Message;
