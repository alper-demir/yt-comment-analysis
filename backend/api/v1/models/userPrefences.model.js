import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const UserPreference = sequelize.define("UserPreference", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    theme: {
        type: DataTypes.ENUM("light", "dark"),
        defaultValue: "light",
    },
    emailNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: "tr",
    }
});

export default UserPreference;