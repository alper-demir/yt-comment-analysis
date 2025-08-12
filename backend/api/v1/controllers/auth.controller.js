import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateAccountVerificationToken, generateToken } from "../utils/jwt.util.js"
import { sendRegisterEmail } from "../utils/email.util.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const exsist = await User.findOne({ where: { email } });
        if (exsist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashedPassword });

        const accountVerificationToken = await generateAccountVerificationToken(user.dataValues.id);

        await sendRegisterEmail(email, null, accountVerificationToken);

        return res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        return res.status(500).json({ message: error, error })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email + " " + password);

    try {

        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "User not found" });

        const decodedPassword = await bcrypt.compare(password, user.password);
        if (!decodedPassword) return res.status(400).json({ message: "Invalid password" });

        const token = await generateToken(user.dataValues.id);
        return res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        return res.status(500).json({ message: error, error })
    }
}

export const accountVerification = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.verified) return res.status(400).json({ message: "This account has already been verified" });

        user.verified = true;
        await user.save();

        return res.status(200).json({ message: "User verified successfully", user });

    } catch (error) {
        return res.status(500).json({ message: error, error })
    }
}