import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Analize = sequelize.define("Analize", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    positive_comment_count: {
        type: DataTypes.INTEGER,
    },
    negative_comment_count: {
        type: DataTypes.INTEGER,
    },
    neutral_comment_count: {
        type: DataTypes.INTEGER,
    },
    total_comment_count: {
        type: DataTypes.INTEGER,
    },
    positive_comment_summary: {
        type: DataTypes.TEXT,
    },
    negative_comment_summary: {
        type: DataTypes.TEXT,
    },
    neutral_comment_summary: {
        type: DataTypes.TEXT,
    },
    input_token: {
        type: DataTypes.INTEGER,
    },
    output_token: {
        type: DataTypes.INTEGER,
    },
    total_token: {
        type: DataTypes.INTEGER,
    },
    videoId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trialAccessAnalysis: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
})

export default Analize;