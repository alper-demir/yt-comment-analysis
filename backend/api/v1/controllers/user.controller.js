import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.util.js';
import UserPreference from './../models/userPrefences.model.js';

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