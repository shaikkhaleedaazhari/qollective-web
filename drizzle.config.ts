import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/lib/schema/*',
    out: './drizzle',
    driver: 'mysql2', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        uri: process.env.DB_URI!,
    },
} satisfies Config;