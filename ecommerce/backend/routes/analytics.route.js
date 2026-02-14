import express from "express";
import { adminroute, protectroute } from "../middleware/auth.middleware.js";
import { getanalyticsdata } from "../controllers/analytics.controller.js";
const router = express.Router();

router.get("/", protectroute, adminroute, async (req, res, next) => {
  try {
    const analyticsdata = await getanalyticsdata();

    const enddate = new Date();
    const startdate = new Date(enddate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailysalesdata = await getdailysalesdata(startdate, enddate);
    res.json({
      analyticsdata,
      dailysalesdata,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
