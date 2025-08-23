import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Purchase = sequelize.define("Purchase", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
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
    }
});


export default Purchase;