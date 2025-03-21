// backend/src/config/database.ts
import { createPool } from "mysql2";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// We won't do a test connection here, but you can if you want
export default pool;
