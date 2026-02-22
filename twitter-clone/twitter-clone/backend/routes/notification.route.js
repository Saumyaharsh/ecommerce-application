import express from "express";
import { protectroutes } from "../middleware/protectroute.js";
import {
  getnotifications,
  deletenotifications,
  deleteonenotification,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protectroutes, getnotifications);
router.delete("/", protectroutes, deletenotifications);
router.delete("/:id", protectroutes, deleteonenotification);

export default router;
