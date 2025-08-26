import express from "express";
import { createCheckoutSession, getPaymentHistory, paymentCallback } from "../controllers/payment.controller.js";
import { auth } from './../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/payment/create-checkout-session", auth, createCheckoutSession);
router.post("/payment/callback", paymentCallback);
router.get("/payment-history", auth, getPaymentHistory);

export default router;