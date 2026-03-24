import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Railway provee variables con prefijo MYSQL, usar esas si existen
const dbConfig = {
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  username: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-03:00'
  }
);

export default sequelize;
