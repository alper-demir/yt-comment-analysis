import sequelize from '../config/db.config.js';
import Purchase from '../models/purchase.model.js';
import TokenPlan from '../models/tokenPlan.model.js';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.util.js';
import UserPreference from './../models/userPrefences.model.js';
import bcrypt from 'bcrypt';

export const updateUserPreference = async (req, res) => {
    const { userId } = req.params;
    try {
        const userPreference = await UserPreference.findOne({ where: { userId } });
        if (!userPreference) return res.status(404).json({ message: 'User not found' });

        await userPreference.update(req.body);
        await userPreference.save();

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: { model: UserPreference, attributes: ['theme', 'language', 'emailNotifications'] }
        });
        const token = await generateToken(user.toJSON())
        res.status(200).json({ message: 'User preference updated successfully', user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const buyTokens = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { planId } = req.body;
        const plan = await TokenPlan.findByPk(planId, { transaction: t });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const user = await User.findByPk(req.user.id, { transaction: t });
        user.tokens += plan.tokens;

        await Promise.all([
            user.save({ transaction: t }),
            Purchase.create({
                userId: user.id,
                planId: plan.id,
                amount: plan.tokens,
                price: plan.price,
                currency: plan.currency
            }, { transaction: t })
        ]);

        await t.commit();
        return res.json({ message: "Token purchased", tokens: user.tokens });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

export const getPurchaseHistory = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]]
        });

        return res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getOneUserRemainingTokens = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId, { attributes: ['tokens'] });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ remainingTokens: user.tokens })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAccountInfo = async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName } = req.body;
    try {

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: { model: UserPreference, attributes: ['theme', 'language', 'emailNotifications'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();
        const token = await generateToken(user.toJSON())
        res.status(200).json({ message: 'Account info updated successfully', user, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getOneUserInfo = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId, { attributes: ['firstName', 'lastName', 'email'] });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: 'Your current password is incorrect.' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}