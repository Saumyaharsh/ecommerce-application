import express from "express";
import { protectroutes } from "../middleware/auth.middleware.js";
const router = express.Router();
import { authcallback } from "../controllers/auth.controller.js";
router.get("/callback", authcallback);

export default router;
