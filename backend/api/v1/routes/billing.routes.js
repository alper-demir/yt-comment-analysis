import express from "express";
import { getTokenPlans } from "../controllers/billing.controller.js";
import { tokenPlansLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

router.get("/token-plans", tokenPlansLimiter, getTokenPlans);

export default router;