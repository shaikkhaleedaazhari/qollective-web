import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = await mysql.createConnection({
    uri: process.env.DB_URI!,
});

export const db = drizzle(poolConnection);