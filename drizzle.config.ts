import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: "./src/lib/schema/*",
  out: "./drizzle",
  dialect: "mysql", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: process.env.DB_URI!,
  },
} satisfies Config;