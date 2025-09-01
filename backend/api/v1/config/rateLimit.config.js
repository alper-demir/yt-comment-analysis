import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "./redis.config.js";

const createRateLimiter = (options) =>
    rateLimit({
        windowMs: options.windowMs || 60 * 1000, // 1 minute
        max: options.max || 60,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message: options.message || "Too many requests, please try again later." },
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
        })
    });

// --- ANALYSIS ENDPOINT ---
export const analyzeLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: "You have requested too many analyses in a short time. Please try again later."
});

// --- TOKEN PLANS ENDPOINT ---
export const tokenPlansLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 50,
    message: "You have requested too many token plans in a short time. Please try again later."
});

// --- PAYMENT ENDPOINTS ---
export const paymentLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5, // max: (req) => req.user.plan || req.user.premium.. -> Limits for premium and plus users may be increased in the future.
    message: "You have requested too many payment operations in a short time. Please try again later."
});

// --- AUTH ENDPOINTS (register/login) ---
export const authLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 10,
    message: "You have requested too many authentication attempts. Please try again later."
});

// --- USER / ANALYSIS HISTORY ---
export const userDataLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 50,
    message: "You have requested too many data fetches in a short time. Please try again later."
});

export const createContactFormLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 10,
    message: "You have requested too many contact form submissions in a short time. Please try again later."
})

export const changePasswordLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: "You have requested too many password changes in a short time. Please try again later."
})

export const updateUserLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 20,
    message: "You have requested too many updates in a short time. Please try again later."
})