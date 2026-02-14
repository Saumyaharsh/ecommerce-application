import express from "express";
import { getallproducts } from "../controllers/product.controller.js";
import { adminroute, protectroute } from "../middleware/auth.middleware.js";
import {
  featuredproducts,
  createproduct,
  deleteproduct,
  getrecommendedproduct,
  getproductbycategory,
  togglefeaturedproduct,
} from "../controllers/product.controller.js";
const router = express.Router();

router.get("/", protectroute, adminroute, getallproducts);
router.get("/featured", featuredproducts);
router.get("/recommendations", protectroute, getrecommendedproduct);
router.get("/category/:category", getproductbycategory);
router.post("/", protectroute, adminroute, createproduct);
router.delete("/:id", protectroute, adminroute, deleteproduct);
router.patch("/:id", protectroute, adminroute, togglefeaturedproduct);

export default router;
