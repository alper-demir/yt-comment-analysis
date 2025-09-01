import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getComments, analizeComments, getAnalizes, getAnalize, getDashboardSummary } from "../controllers/analysis.controller.js";
import { limitFreeAccessByIp } from "../middlewares/limitFreeAccessByIp.middleware.js";
import { analysisAuth } from "../middlewares/analysisAuth.middleware.js";
import { analyzeLimiter, userDataLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

router.get("/yt-video/:id", analysisAuth, analyzeLimiter, limitFreeAccessByIp, getComments);
router.post("/analyze-comments", analysisAuth, analizeComments);
router.get("/analizes", auth, userDataLimiter, getAnalizes);
router.get("/analize/:id", auth, userDataLimiter, getAnalize);
router.get("/dashboard-summary", auth, userDataLimiter, getDashboardSummary);

export default router;