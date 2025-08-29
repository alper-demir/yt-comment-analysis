import cron from "node-cron";
import Payment from "../models/payment.model.js";
import sequelize from "../config/db.config.js";
import { Op } from 'sequelize';

// Runs every day at 03.00
cron.schedule("0 3 * * *", async () => {
    console.log("[CRON] Pending payment cleanup started");

    const t = await sequelize.transaction();
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 min

        const deletedCount = await Payment.destroy({
            where: {
                status: "PENDING",
                createdAt: {
                    [Op.lt]: fiveMinutesAgo
                },
            },
            transaction: t
        });

        await t.commit();
        console.log(`[CRON] Pending payment cleanup finished. Deleted: ${deletedCount}`);
    } catch (err) {
        await t.rollback();
        console.error("[CRON] Pending payment cleanup error:", err);
    }
});