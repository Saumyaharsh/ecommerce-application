import express from "express";
import protectroutes from "../middleware/protect.routes.js";
import { sendmessage, getmessage } from "../controllers/message.controller.js";
const router = express.Router();
router.post("/send/:id", protectroutes, sendmessage);
router.get("/:id", protectroutes, getmessage);

export default router;
