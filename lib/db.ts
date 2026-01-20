// /src/lib/db.ts

import { createClient, type Client } from "@libsql/client";

// 環境変数から接続情報を取得
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let client: Client | null = null;

/**
 * Turso (libSQL) クライアントを初期化または取得する関数
 * この関数はServer ComponentやServer Action内でのみ実行される
 */
export const getDbClient = (): Client => {
  if (!url) {
    throw new Error("TURSO_DATABASE_URL が設定されていません。");
  }
  
  // 開発環境で接続クライアントがまだ存在しなければ作成
  // 本番環境ではリクエストごとに接続を管理するため、ここではシンプルに実装
  if (!client) {
    client = createClient({
      url: url,
      authToken: authToken,
    });
    console.log("✅ Turso DB クライアントを初期化しました。");
  }
  
  return client;
};