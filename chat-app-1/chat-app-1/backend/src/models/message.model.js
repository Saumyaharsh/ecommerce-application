import { mongoose as Mongoose } from "mongoose";
const messageschema = new Mongoose.Schema(
  {
    Senderid: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Receiverid: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);
const Message = Mongoose.model("Message", messageschema);
export default Message;
