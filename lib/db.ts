// db.ts (場所を再確認してください！ srcの中か、外か)
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export const getDbClient = (): Client => {
  // 関数が呼ばれるまで process.env を見に行かないようにする
  const url = process.env.TURSO_DATABASE_URL || "libsql://dummy-url.turso.io";
  const authToken = process.env.TURSO_AUTH_TOKEN || "dummy";

  if (!client) {
    client = createClient({
      url: url,
      authToken: authToken,
    });
    console.log("✅ Turso DB Client Initialized");
  }
  
  return client;
};
