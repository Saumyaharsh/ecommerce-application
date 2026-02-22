import express from "express";
import { protectroutes } from "../middleware/protectroute.js";
import {
  addorremovefollowers,
  getsuggestedusers,
  getuserprofile,
  updateuser,
} from "../controller/user.controller.js";

const router = express.Router();
router.post("/follow/:id", protectroutes, addorremovefollowers);
router.get("/suggested", protectroutes, getsuggestedusers);
router.get("/profile/:username", protectroutes, getuserprofile);
router.post("/profile/update", protectroutes, updateuser);

export default router;
