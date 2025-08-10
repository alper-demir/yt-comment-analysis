import { verifyToken } from "../utils/jwt.util.js";

export const analysisAuth = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            req.user = { userId: null };
            return next();
        };

        const token = bearerToken.split(" ")[1];

        if (!token) return res.status(401).json({ message: "A valid token format was not provided.", authNverification: false });

        const verify = await verifyToken(token);
        if (!verify.status) return res.status(401).json({ message: verify.message, authNverification: false })
        req.user = verify.payload;
        next();
    } catch (error) {
        return res.status(500).json({ message: error, error })
    }
}