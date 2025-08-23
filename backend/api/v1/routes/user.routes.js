import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { buyTokens, getPurchaseHistory, updateUserPreference } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/preferences/:userId", auth, updateUserPreference);
router.post("/buy-tokens", auth, buyTokens);
router.get("/purchase-history", auth, getPurchaseHistory);

export default router;