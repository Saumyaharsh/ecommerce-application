import express from "express";
import { protectroute } from "../middleware/auth.middleware.js";
import {
  getcartproducts,
  addtocart,
  removeallfromcart,
  updatequantity,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.get("/", protectroute, getcartproducts);
router.post("/", protectroute, addtocart);
router.delete("/", protectroute, removeallfromcart);
router.put("/:id", protectroute, updatequantity);

export default router;
