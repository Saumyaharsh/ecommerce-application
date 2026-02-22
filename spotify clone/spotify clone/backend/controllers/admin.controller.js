import cloudinary from "../config/cloudinary.js";
import Album from "../models/album.model.js";
import Song from "../models/song.model.js";

const uploadoncloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const createsong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ error: "Please upload all files" });
    }
    // helper function to files in cloudinary

    const { title, artist, albumid, duration } = req.body;
    const audiofile = req.files.audioFile;
    const imagefile = req.files.imageFile;

    // saving audiofile and imagefile to cloudinary
    const imageurl = uploadoncloudinary(imagefile);
    const audiourl = uploadoncloudinary(audiofile);

    const newsong = new Song({
      title,
      artist,
      imageurl,
      audiourl,
      duration,
      albumid: albumid || null,
    });
    await newsong.save();
    if (albumid) {
      await Album.findByIdAndUpdate(albumid, {
        $push: { songs: newsong._id },
      });
    }
    res.status(201).json(newsong);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const deletesong = async (req, res, next) => {
  try {
    const id = req.params.id;
    // find the song
    const song = await Song.findById(id);

    // if there is song and it is also present in album then delete from all albums
    if (song.albumid) {
      await Album.findByIdAndUpdate(song.albumid, {
        $pull: { songs: song._id },
      });
    }

    // Now deleting the song
    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createalbum = async (req, res, next) => {
  try {
    const { title, artist, releaseyear } = req.body;
    const imagefile = req.files.imageFile;
    const imageurl = uploadoncloudinary(imagefile);
    const newalbum = new Album({
      title,
      artist,
      releaseyear,
      imageurl,
    });
    await newalbum.save();
    res.status(201).json(newalbum);
  } catch (error) {
    next(error);
  }
};

export const deletealbum = async (req, res, next) => {
  try {
    const id = req.params.id;
    // deleting the refereb=nce of album that is albumid from song
    await Song.deleteMany({ albumid: id });
    // deleting album
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkadmin = async (req, res, next) => {
  try {
    res.status(200).json({ admin: true });
  } catch (error) {
    next(error);
  }
};
