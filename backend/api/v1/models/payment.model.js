import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import TokenPlan from "./tokenPlan.model.js";
import User from "./user.model.js";

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    planId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TokenPlan,
            key: "id"
        }
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
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
    status: {
        type: DataTypes.ENUM("SUCCESS", "PENDING", "FAILURE"),
        allowNull: false,
        defaultValue: "PENDING"
    }
});

export default Payment;