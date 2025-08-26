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
        const user = await User.findByPk(userId, { attributes: ['firstName', 'lastName', 'email', 'verified'] });
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
        user.lastPasswordChange = new Date();
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}