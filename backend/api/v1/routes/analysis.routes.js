import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getComments, analizeComments, getAnalizes, getAnalize, getDashboardSummary } from "../controllers/analysis.controller.js";
import { limitFreeAccessByIp } from "../middlewares/limitFreeAccessByIp.middleware.js";
import { analysisAuth } from "../middlewares/analysisAuth.middleware.js";

const router = express.Router();

router.get("/yt-video/:id", analysisAuth, limitFreeAccessByIp, getComments);
router.post("/analyze-comments", analysisAuth, analizeComments);
router.get("/analizes", auth, getAnalizes);
router.get("/analize/:id", auth, getAnalize);
router.get("/dashboard-summary", auth, getDashboardSummary);

export default router;