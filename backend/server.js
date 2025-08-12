import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./api/v1/config/db.config.js"
import sequelize from "./api/v1/config/db.config.js";
import User from "./api/v1/models/user.model.js";
import authRoutes from "./api/v1/routes/auth.routes.js"
import analysisRoutes from "./api/v1/routes/analysis.routes.js"
import { clientIpMiddleware } from "./api/v1/middlewares/clientIp.middleware.js";
import { requestLogger } from "./api/v1/logging/request.logger.js";
import "./api/v1/models/index.js"
import UserPreference from "./api/v1/models/userPrefences.model.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.set('trust proxy', true);

app.use(clientIpMiddleware);
app.use(requestLogger);

app.use("/api/v1", authRoutes);
app.use("/api/v1", analysisRoutes);

const PORT = process.env.PORT || 3001;

//await sequelize.sync({ alter: true });
//await sequelize.sync({ force: true });
// const user = await User.findByPk("008231ba-a17f-4c69-af5c-95bd892d0266", { attributes: { exclude: ['password'] }, include: UserPreference });
// const data = user.get({ plain: true })
// console.log(data);

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});