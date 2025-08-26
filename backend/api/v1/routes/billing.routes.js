import express from "express";
import { getTokenPlans } from "../controllers/billing.controller.js";

const router = express.Router();

router.get("/token-plans", getTokenPlans);

export default router;