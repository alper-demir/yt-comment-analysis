import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config();

let sequelize;

if (process.env.NODE_ENV === "development") {
    // local db
    sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT
    });
} else {
    // supabase db
    sequelize = new Sequelize(process.env.SUPABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
    });
}

try {
    await sequelize.authenticate();
    console.log(`Database connection has been established successfully.(${process.env.NODE_ENV === "development" ? "local" : "supabase"})`);
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;