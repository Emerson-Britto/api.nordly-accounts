import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(process.env.MYSQL_CONNECTION_STRING || "");
export default sequelize;
