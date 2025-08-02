import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getComments, analizeComments } from "../controllers/analysis.controller.js";
import { limitFreeAccessByIp } from "../middlewares/limitFreeAccessByIp.middleware.js";

const router = express.Router();

router.get("/yt-video/:id", auth, limitFreeAccessByIp, getComments);
router.post("/analyze-comments", auth, analizeComments);

export default router;