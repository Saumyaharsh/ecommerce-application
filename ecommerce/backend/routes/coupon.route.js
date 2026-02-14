import express from "express";
import { protectroute } from "../middleware/auth.middleware.js";
import { getcoupon, validatecoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectroute, getcoupon);
router.post("/validate", protectroute, validatecoupon);

export default router;
