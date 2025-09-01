import express from "express";
import { createCheckoutSession, getPaymentHistory, paymentCallback } from "../controllers/payment.controller.js";
import { auth } from './../middlewares/auth.middleware.js';
import { paymentLimiter, userDataLimiter } from "../config/rateLimit.config.js";

const router = express.Router();

router.post("/payment/create-checkout-session", auth, paymentLimiter, createCheckoutSession);
router.post("/payment/callback", paymentCallback);
router.get("/payment-history", auth, userDataLimiter, getPaymentHistory);

export default router;