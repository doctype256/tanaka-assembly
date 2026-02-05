// scripts/check-turso.ts
// Turso データベースの内容を確認するスクリプト

import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const tursoUrl = process.env.TURSO_DATABASE_URL || "libsql://testdata-kyoto343.aws-ap-northeast-1.turso.io";
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoToken) {
  console.error("❌ TURSO_AUTH_TOKEN is not set");
  process.exit(1);
}

const db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

async function checkTurso() {
  try {
    console.log("🔍 Checking Turso database...\n");

    // コメント数を確認
    const commentsResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM comments",
    });
    const commentCountRow = (commentsResult.rows || [])[0] as any;
    const commentCount = commentCountRow?.count || 0;
    console.log(`📝 Comments: ${commentCount}`);

    if (commentCount > 0) {
      const allComments = await db.execute({
        sql: "SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC",
      });
      console.log("   Recent comments:");
      const comments = allComments.rows || [];
      comments.slice(0, 3).forEach((comment: any, idx: number) => {
        console.log(`   ${idx + 1}. ${comment.name} - ${(comment.message as string).substring(0, 30)}...`);
      });
    }

    // お問い合わせ数を確認
    const contactsResult = await db.execute({
      sql: "SELECT COUNT(*) as count FROM contacts",
    });
    const contactCountRow = (contactsResult.rows || [])[0] as any;
    const contactCount = contactCountRow?.count || 0;
    console.log(`\n📧 Contacts: ${contactCount}`);

    if (contactCount > 0) {
      const allContacts = await db.execute({
        sql: "SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC",
      });
      console.log("   Recent contacts:");
      const contacts = allContacts.rows || [];
      contacts.slice(0, 3).forEach((contact: any, idx: number) => {
        console.log(`   ${idx + 1}. ${contact.name} (${contact.email})`);
      });
    }

    // --- ここから追記 ---
    console.log("\n--- 📂 全テーブル一覧確認 ---");
    
    // 存在するテーブル一覧を取得
    const tablesRes = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );
    const tableNames = tablesRes.rows.map(row => row.name as string);

    for (const tableName of tableNames) {
      // 既に上で表示しているテーブルはスキップ（重複を避ける場合）
      if (tableName === 'comments' || tableName === 'contacts') continue;

      const content = await db.execute(`SELECT * FROM ${tableName} LIMIT 5;`);
      console.log(`\n📊 TABLE: ${tableName} (${content.rows.length} records)`);
      
      if (content.rows.length > 0) {
        console.table(content.rows);
      } else {
        console.log("   (データなし)");
      }
    }
    // --- ここまで追記 ---

    console.log("\n✅ Turso database check complete");
  } catch (error) {
    console.error("❌ Error checking Turso database:", error);
    process.exit(1);
  }
}

checkTurso();
