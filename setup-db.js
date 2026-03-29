import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
});

try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'placementdb'}`);
  console.log(`✅ Database '${process.env.DB_NAME || 'placementdb'}' created successfully!`);
} catch (error) {
  console.error('❌ Error creating database:', error.message);
} finally {
  await connection.end();
}
