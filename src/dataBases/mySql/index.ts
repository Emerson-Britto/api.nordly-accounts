import { Sequelize } from 'sequelize';
const instance = new Sequelize(process.env.MYSQL_CONNECTION_STRING);
export default instance;