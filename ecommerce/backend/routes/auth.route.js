import express from "express";
import {
  signup,
  logout,
  login,
  refreshtoken,
  getprofile,
} from "../controllers/auth.controller.js";
import { protectroute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshtoken);
router.get("/profile", protectroute, getprofile);
export default router;
