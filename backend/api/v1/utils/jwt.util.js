import jwt from "jsonwebtoken"

export const generateToken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

export const verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error) => {
        if (error) return { status: false, message: error.message };
        return { status: true };
    });
}

export const generateAccountVerificationToken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}