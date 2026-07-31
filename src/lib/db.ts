import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL is controlled via sslmode=require in the connection string
  // e.g. postgresql://user:pass@host/db?sslmode=require
});

export default pool;
