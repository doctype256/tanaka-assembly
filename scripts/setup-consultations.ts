// directory: scripts/setup-consultations.ts

import { client } from '../db/client';

/**
 * データベースの初期化：相談テーブルと設定用テーブルの構築
 */
async function setup() {
  try {
    console.log("⏳ Database schema updating...");

    // 1. 相談内容保存テーブル
    await client.execute(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_type TEXT NOT NULL,
        place_type TEXT NOT NULL,
        content_type TEXT NOT NULL,
        needs_reply INTEGER DEFAULT 0,
        email TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        ip_hash TEXT NOT NULL,
        user_agent TEXT,
        referer_url TEXT,
        created_at DATETIME DEFAULT (datetime('now', 'localtime'))
      );
    `);

    // 2. システム設定用テーブル
    await client.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
      );
    `);

    // 3. 設定値の初期レコード登録（メール通知用、送信用Gmail、送信用パスワード）
    // すでにキーが存在する場合は無視(IGNORE)し、ない場合のみ空文字で作成します
    const initialSettings = [
      ['admin_notification_email', ''], // 通知を受け取る議員本人のメアド
      ['smtp_user', ''],               // 送信元として使うGmailアドレス
      ['smtp_pass', '']                // Googleで発行した16桁のアプリパスワード
    ];

    for (const [key, value] of initialSettings) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)",
        args: [key, value]
      });
    }

    console.log("✅ Database tables and initial settings are ready.");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

setup();