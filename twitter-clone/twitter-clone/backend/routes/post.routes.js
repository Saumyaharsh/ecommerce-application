import express from "express";
import { protectroutes } from "../middleware/protectroute.js";
import {
  createpost,
  deletepost,
  commentonpost,
  likeunlikepost,
  getallposts,
  getlikedposts,
  getfollowingposts,
  getuserposts,
} from "../controller/post.controller.js";
const router = express.Router();

router.get("/all", protectroutes, getallposts);
router.get("/likes/:id", protectroutes, getlikedposts);
router.get("/following", protectroutes, getfollowingposts);
router.get("/user/:username", protectroutes, getuserposts);

router.post("/create", protectroutes, createpost);
router.post("/like/:id", protectroutes, likeunlikepost);
router.post("/comment/:id", protectroutes, commentonpost);
router.delete("/:id", protectroutes, deletepost);

export default router;
