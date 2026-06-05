import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// console.log(
//   "🔗 Attempting to connect to the database with connection string: ",
//   connectionString,
// );

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(connectionString);

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

// console.log("✅ Database connection established successfully!: ", conn);

export const db = drizzle(conn, { schema });
