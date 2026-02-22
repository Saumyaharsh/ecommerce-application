import Album from "../models/album.model.js";

export const getallalbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getalbumbyid = async (req, res, next) => {
  try {
    const { albumid } = req.body;
    const album = await Album.findById(albumid).populate("songs"); // fetching all songs
    if (!album) {
      return next(res.status(404).json("Not found"));
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};
