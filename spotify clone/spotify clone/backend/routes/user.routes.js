import express from "express";
import { protectroutes } from "../middleware/auth.middleware.js";
import { getallusers } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", protectroutes, getallusers);
// to do message functionality
export default router;
