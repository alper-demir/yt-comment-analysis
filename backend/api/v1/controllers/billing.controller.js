import TokenPlan from "../models/tokenPlan.model.js";
import redisClient from "../config/redis.config.js";

const TOKEN_PLANS_CACHE_KEY = "tokenPlans";
const CACHE_TTL = 60 * 60; // 1 hour (TTL)

export const getTokenPlans = async (req, res) => {
    try {
        const cachedPlans = await redisClient.get(TOKEN_PLANS_CACHE_KEY);
        if (cachedPlans) return res.json(JSON.parse(cachedPlans));

        const plans = await TokenPlan.findAll({ order: [["tokens", "ASC"]] });
        if (!plans) return res.status(404).json({ message: "Plans not found" });

        await redisClient.set(TOKEN_PLANS_CACHE_KEY, JSON.stringify(plans), "EX", CACHE_TTL);
        return res.json(plans);
    } catch (error) {
        console.error("getTokenPlans error:", error);
        res.status(500).json({ message: error.message });
    }
};