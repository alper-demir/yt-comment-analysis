import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { register, login, accountVerification } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-token", auth, (req, res) => {
    return res.status(200).json({ message: "Test successful", authNverification: true, user: req.user })
})
router.get("/verify-account/:userId", accountVerification);

export default router;