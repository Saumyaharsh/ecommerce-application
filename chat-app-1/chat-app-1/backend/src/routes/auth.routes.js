import express from "express";
const router = express.Router();
import { protectroutes } from "../middleware/auth.middleware.js";
import { updateprofile } from "../controllers/auth.controller.js";
import { checkauth } from "../controllers/auth.controller.js";

import { login, signup, logout } from "../controllers/auth.controller.js";
router.post("/login", login);
router.post("/signup", signup);

router.post("/logout", logout);
router.put("/update-profile", protectroutes, updateprofile);
router.get("/check", protectroutes, checkauth);
export default router;
