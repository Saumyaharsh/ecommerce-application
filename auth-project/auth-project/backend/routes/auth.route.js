import express, { Router } from "express";
import {
  signup,
  login,
  logout,
  verifyemail,
  forgotpassword,
  resetpassword,
  checkauth,
} from "../controllers/auth.controller.js";
import { verifytoken } from "../middleware/verifytoken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyemail);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password/:token", resetpassword);

router.get("/check-auth", verifytoken, checkauth);
export default router;
