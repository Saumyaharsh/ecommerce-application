import express from "express";
const router = express.Router();
import { getallalbums, getalbumbyid } from "../controllers/album.controller.js";
router.get("/", getallalbums);
router.get("/:albumid", getalbumbyid);

export default router;
