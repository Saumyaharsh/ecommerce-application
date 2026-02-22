import express from "express";
import { getuserforuser } from "../controllers/user.controller.js";
import protectroutes from "../middleware/protect.routes.js";
const router = express.Router();
router.get("/", protectroutes, getuserforuser);
export default router;
