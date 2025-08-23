import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const TokenPlan = sequelize.define("TokenPlan", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    tokens: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "TRY"
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default TokenPlan;