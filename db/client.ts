// db/client.ts
import { createClient, Client } from "@libsql/client";

/**
 * db の型: Turso Client
 */
let db: Client;

// ===== Turso (Local & Production) =====
const tursoUrl = process.env.TURSO_DATABASE_URL || "libsql://testdata-kyoto343.aws-ap-northeast-1.turso.io";
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoToken) {
  throw new Error("TURSO_AUTH_TOKEN is not set in environment variables");
}

db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

console.log("✅ Using Turso database");

export default db;
