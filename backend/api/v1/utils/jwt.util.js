import jwt from "jsonwebtoken"

export const generateToken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            status: true,
            payload: decoded // userId
        };
    } catch (error) {
        return {
            status: false,
            message: error.message
        };
    }
};


export const generateAccountVerificationToken = async (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}