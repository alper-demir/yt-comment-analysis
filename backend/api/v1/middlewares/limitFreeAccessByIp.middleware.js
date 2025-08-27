import TrialAccess from "../models/trialAccess.model.js";
import User from "../models/user.model.js";

const FREE_LIMIT = 2;

export const limitFreeAccessByIp = async (req, res, next) => {
    const ip = req.clientIp || req.ip;
    const { userId } = req.user;
    try {

        if (userId !== null) {
            const user = await User.findByPk(userId, { attributes: ['tokens'] });
            if (user.tokens > 0) {
                return next();
            }
        }

        let record = await TrialAccess.findOne({ where: { ip } });
        
        if (!record) {
            record = await TrialAccess.create({ ip, usage_count: 1, last_access_at: new Date() });
            return next();
        }

        if (record.usage_count >= FREE_LIMIT) {
            return res.status(403).json({
                success: false,
                message: "Your free trial has expired. Please subscribe or purchase tokens.",
            });
        }

        record.usage_count += 1;
        record.last_access_at = new Date();
        await record.save();

        console.log(`[FREE ACCESS] ${ip} → ${record.usage_count}. usage`);
        next();

    } catch (error) {
        console.error('TrialAccess DB error:', error);
        next();
    }
}