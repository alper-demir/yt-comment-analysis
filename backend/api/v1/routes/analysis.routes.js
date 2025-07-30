import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getComments, analizeComments } from "../controllers/analysis.controller.js";

const router = express.Router();

router.get("/yt-video/:id", auth, getComments);
router.post("/analyze-comments", auth, analizeComments);

export default router;