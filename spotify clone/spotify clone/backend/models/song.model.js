import mongoose from "mongoose";
const songmodel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageurl: {
      type: String,
      required: true,
    },
    audiourl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    albumid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
  },
  { timestamps: true }
);
const Song = mongoose.model("Song", songmodel);
export default Song;
