import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const TrialAccess = sequelize.define("TrialAccess", {
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    usage_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    last_access_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

export default TrialAccess;