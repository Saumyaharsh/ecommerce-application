import express from "express";
import { getadmin, protectroutes } from "../middleware/auth.middleware.js";
import {
  getallsongs,
  getmadeforyousongs,
  featuredsongs,
  gettrendingsongs,
} from "../controllers/song.controller.js";
const router = express.Router();

router.post("/", protectroutes, getadmin, getallsongs);
router.post("/featured", featuredsongs);
router.post("/made-for-you", getmadeforyousongs);
router.post("/trending", gettrendingsongs);

export default router;
