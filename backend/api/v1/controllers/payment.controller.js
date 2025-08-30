import iyzipay from "../config/iyzico.config.js";
import Payment from "../models/payment.model.js";
import TokenPlan from './../models/tokenPlan.model.js';
import User from './../models/user.model.js';
import Iyzipay from "iyzipay";
import sequelize from "../config/db.config.js";
import { Op } from "sequelize";

export const createCheckoutSession = async (req, res) => {
    const clientIp = req.clientIp;
    const userId = req.user.id;

    const t = await sequelize.transaction();

    try {
        const { planId } = req.body;

        const user = await User.findByPk(userId, { attributes: ['id', 'firstName', 'lastName', 'email'], transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        const plan = await TokenPlan.findByPk(planId, { transaction: t });
        if (!plan) {
            await t.rollback();
            return res.status(404).json({ message: "Plan not found" });
        }

        const conversationId = new Date().getTime().toString();

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId,
            price: plan.price,
            paidPrice: plan.price,
            currency: plan.currency,
            basketId: "B" + plan.id,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.BACKEND_URL}/payment/callback`,
            buyer: {
                id: user.id.toString(),
                name: user.firstName,
                surname: user.lastName,
                gsmNumber: user.phone || "+905555555555",
                email: user.email,
                identityNumber: "11111111111",
                registrationAddress: "Türkiye",
                ip: clientIp,
                city: "İstanbul",
                country: "Turkey",
            },
            billingAddress: {
                contactName: `${user.firstName} ${user.lastName}`,
                city: "İstanbul",
                country: "Turkey",
                address: "Türkiye",
            },
            basketItems: [
                {
                    id: plan.id,
                    name: `${plan.tokens} Tokens`,
                    category1: "Token Package",
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: plan.price
                }
            ]
        };

        iyzipay.checkoutFormInitialize.create(request, async (err, result) => {
            if (err) {
                await t.rollback();
                return res.status(500).json(err);
            }

            await Payment.create({
                userId: user.id,
                planId: plan.id,
                paymentId: result.token,
                conversationId: conversationId,
                amount: plan.tokens,
                price: plan.price,
                currency: plan.currency,
                status: "PENDING"
            }, { transaction: t });

            await t.commit();

            res.json({
                checkoutFormContent: result.checkoutFormContent,
                paymentPageUrl: result.paymentPageUrl,
                token: result.token,
                conversationId
            });
        });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Payment initialization failed" });
    }
};

export const paymentCallback = async (req, res) => {
    const token = req.body.token || req.query.token;
    if (!token) return res.status(400).send("Token yok");

    iyzipay.checkoutForm.retrieve({ token }, async (err, result) => {
        if (err) return res.status(500).send(err);

        const t = await sequelize.transaction();

        try {
            const status = result.paymentStatus; // SUCCESS / FAIL / PENDING
            const payment = await Payment.findOne({ where: { paymentId: result.token }, transaction: t });
            if (!payment) {
                await t.rollback();
                return res.status(404).send("Payment not found");
            }

            payment.status = status;
            await payment.save({ transaction: t });

            if (status === "SUCCESS") {
                const user = await User.findByPk(payment.userId, { transaction: t });
                if (!user) {
                    await t.rollback();
                    return res.status(404).send("User not found");
                }

                user.tokens += payment.amount;
                await user.save({ transaction: t });
            }

            await t.commit();

            const planId = payment.planId;
            res.redirect(`${process.env.FRONTEND_URL}/payment/result?status=${status}&planId=${planId}`);
        } catch (dbErr) {
            console.error("Payment DB error:", dbErr);
            await t.rollback();
            res.status(500).send("Payment DB error");
        }
    });
};

export const getPaymentHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const purchases = await Payment.findAndCountAll({
            where: { userId: req.user.id, status: { [Op.in]: ['SUCCESS', 'FAILURE'] } },
            order: [["createdAt", "DESC"]],
            offset,
            limit,
            include: { model: TokenPlan, attributes: ['name'] }
        });

        return res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};