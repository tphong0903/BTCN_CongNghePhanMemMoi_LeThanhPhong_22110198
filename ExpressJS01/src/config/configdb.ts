import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UserModel from "../models/user";
import ProductModel from "../models/product";
import CommentModel from "../models/comment";
import favorite from "../models/favorite";

dotenv.config();

// Lấy config từ env
const DB_NAME = process.env.DB_NAME || "node_fulltask";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_DIALECT = (process.env.DB_DIALECT as any) || "mysql";

// Kết nối để tạo database nếu chưa có
const sequelizeInit = new Sequelize("mysql", DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

// Kết nối database chính
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

// Initialize models
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Comment = CommentModel(sequelize);
const Favorite = favorite(sequelize);

const connectDB = async () => {
  try {
    // Tạo database nếu chưa tồn tại
    await sequelizeInit.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database '${DB_NAME}' exists or created.`);

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("Database models synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDB;
export { sequelize, User };
