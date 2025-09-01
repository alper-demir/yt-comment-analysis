import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getOneUserRemainingTokens, updateAccountInfo, updateUserPreference, getOneUserInfo, changePassword, createContactRecord } from "../controllers/user.controller.js";
import { changePasswordLimiter, createContactFormLimiter, updateUserLimiter, userDataLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

router.put("/preferences/:userId", auth, updateUserLimiter, updateUserPreference);
router.get("/remaining-tokens/:userId", auth, userDataLimiter, getOneUserRemainingTokens);
router.put("/account/:userId", auth, updateUserLimiter, updateAccountInfo);
router.get("/account/:userId", auth, userDataLimiter, getOneUserInfo);
router.put("/account/change-password/:userId", auth, changePasswordLimiter, changePassword);
router.post("/contact/create", auth, createContactFormLimiter, createContactRecord);

export default router;