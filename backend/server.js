import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import "./api/v1/config/db.config.js"
import authRoutes from "./api/v1/routes/auth.routes.js"
import analysisRoutes from "./api/v1/routes/analysis.routes.js"
import userRoutes from "./api/v1/routes/user.routes.js"
import billingRoutes from "./api/v1/routes/billing.routes.js"
import paymentRoutes from "./api/v1/routes/payment.routes.js"
import { clientIpMiddleware } from "./api/v1/middlewares/clientIp.middleware.js";
import { requestLogger } from "./api/v1/logging/request.logger.js";
import "./api/v1/models/index.js"
import bodyParser from "body-parser";
import sequelize from "./api/v1/config/db.config.js";
import "./api/v1/cron/cleanPendingPayments.js";
import "./api/v1/config/redis.config.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', true);

app.use(clientIpMiddleware);
app.use(requestLogger);

app.use("/api/v1", authRoutes);
app.use("/api/v1", analysisRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", billingRoutes);
app.use("/api/v1", paymentRoutes);

const PORT = process.env.PORT || 3001;

//await sequelize.sync({ alter: true });

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});