import TokenPlan from "../models/tokenPlan.model.js";

export const getTokenPlans = async (req, res) => {
    try {
        const plans = await TokenPlan.findAll({ order: [["tokens", "ASC"]], });
        if (!plans) return res.status(404).json({ message: "Plans not found" });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
