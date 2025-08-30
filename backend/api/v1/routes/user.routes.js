import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getOneUserRemainingTokens, updateAccountInfo, updateUserPreference, getOneUserInfo, changePassword, createContactRecord } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/preferences/:userId", auth, updateUserPreference);
router.get("/remaining-tokens/:userId", auth, getOneUserRemainingTokens);
router.put("/account/:userId", auth, updateAccountInfo);
router.get("/account/:userId", auth, getOneUserInfo);
router.put("/account/change-password/:userId", auth, changePassword);
router.post("/contact/create", auth, createContactRecord);

export default router;