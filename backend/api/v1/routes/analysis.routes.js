import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getComments, analizeComments } from "../controllers/analysis.controller.js";
import { limitFreeAccessByIp } from "../middlewares/limitFreeAccessByIp.middleware.js";
import { analysisAuth } from "../middlewares/analysisAuth.middleware.js";

const router = express.Router();

router.get("/yt-video/:id", analysisAuth, limitFreeAccessByIp, getComments);
router.post("/analyze-comments", analysisAuth, analizeComments);

export default router;