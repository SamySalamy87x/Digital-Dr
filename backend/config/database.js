const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL connection pool configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'digital_dr',
  user: process.env.DB_USER || 'digital_dr_user',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected connection pool error:', err);
  process.exit(-1);
});

// Query method
const query = (text, params) => pool.query(text, params);

// Get a client from the pool
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  query,
  getClient,
  pool
};
