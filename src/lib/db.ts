import { drizzle } from "drizzle-orm/mysql2";
import * as questionSchema from "./schema/questions";
import * as authSchema from "./schema/auth";
import mysql from "mysql2/promise";

DB_URI=""

function singleton<Value>(name: string, value: () => Value): Value {
  const globalAny: any = global;
  globalAny.__singletons = globalAny.__singletons || {};

  if (!globalAny.__singletons[name]) {
    globalAny.__singletons[name] = value();
  }

  return globalAny.__singletons[name];
}

// Function to create the database connection and apply migrations if needed
function createDatabaseConnection() {
  const poolConnection = mysql.createPool(process.env.DB_URI!);
  return drizzle(poolConnection, {
    schema: {
      ...questionSchema,
      ...authSchema,
    },
    mode: "default",
  });
}

export const db = singleton("db", createDatabaseConnection);
