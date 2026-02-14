import express from "express";

const router = express.Router();
import { protectroute } from "../middleware/auth.middleware.js";
import {
  createcheckoutsession,
  checkoutsuccess,
} from "../controllers/payment.controller.js";
router.post("/create-checkout-session", protectroute, createcheckoutsession);
router.post("/checkout-success", protectroute, checkoutsuccess);

export default router;
