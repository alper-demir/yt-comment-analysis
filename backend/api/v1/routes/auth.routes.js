import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { register, login, accountVerification } from "../controllers/auth.controller.js";
import { authLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/verify-token", auth, (req, res) => {
    return res.status(200).json({ message: "Test successful", authNverification: true, user: req.user })
})
router.get("/verify-account/:userId", authLimiter, accountVerification);

export default router;