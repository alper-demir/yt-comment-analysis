import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { updateUserPreference } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/preferences/:userId", auth, updateUserPreference);

export default router;