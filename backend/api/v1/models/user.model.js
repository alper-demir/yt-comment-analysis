import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
})

export default User;