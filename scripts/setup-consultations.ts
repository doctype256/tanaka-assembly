// directory: scripts/setup-consultations.ts

import { client } from '../db/client';

/**
 * 相談ポスト用のテーブルとインデックスを作成するスクリプト
 */
async function setup() {
  try {
    console.log("⏳ Creating consultations table...");

    // 1. テーブル作成
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

    // 2. インデックス作成（連投防止・削除高速化用）
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_consultation_limit ON consultations (ip_hash, created_at);`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_consultation_expiry ON consultations (created_at);`);

    console.log("✅ Consultations table and indexes created successfully.");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

setup();