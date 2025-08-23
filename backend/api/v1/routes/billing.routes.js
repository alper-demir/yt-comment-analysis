import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getTokenPlans } from "../controllers/billing.controller.js";

const router = express.Router();

router.get("/token-plans", auth, getTokenPlans);

export default router;