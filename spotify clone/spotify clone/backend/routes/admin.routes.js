import express from "express";
import { getadmin, protectroutes } from "../middleware/auth.middleware.js";
import { createsong } from "../controllers/admin.controller.js";
import {
  deletesong,
  createalbum,
  deletealbum,
  checkadmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protectroutes, getadmin);

router.get("/check", checkadmin);
router.post("/songs", createsong);
router.delete("/songs/:id", deletesong);

router.post("/album", createalbum);
router.delete("/album/:id", deletealbum);

export default router;
