import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { buyTokens, getOneUserRemainingTokens, getPurchaseHistory, updateAccountInfo, updateUserPreference, getOneUserInfo, changePassword } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/preferences/:userId", auth, updateUserPreference);
router.post("/buy-tokens", auth, buyTokens);
router.get("/purchase-history", auth, getPurchaseHistory);
router.get("/remaining-tokens/:userId", auth, getOneUserRemainingTokens);
router.put("/account/:userId", auth, updateAccountInfo);
router.get("/account/:userId", auth, getOneUserInfo);
router.put("/account/change-password/:userId", auth, changePassword);

export default router;