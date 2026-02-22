import express from "express";
import { getadmin, protectroutes } from "../middleware/auth.middleware.js";
import { fetchstats } from "../controllers/stat.controller.js";
const router = express.Router();

router.get("/", protectroutes, getadmin, fetchstats);

export default router;
