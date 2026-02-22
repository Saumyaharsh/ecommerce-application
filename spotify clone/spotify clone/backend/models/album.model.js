import mongoose from "mongoose";
import Song from "./song.model.js";
const albmschema = mongoose.Schema({
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
  releaseyear: {
    type: Number,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});
const Album = mongoose.model("Album", albmschema);
export default Album;
