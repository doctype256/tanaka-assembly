import { getDbClient } from '@/lib/db';

export class UserRepository {
  private db = getDbClient();

  async getDisplayName(username: string): Promise<string> {
    try {
      // 🔍 ターミナルで確認
      console.log(`[UserRepository] DB検索開始 (username: ${username})`);

      const result = await this.db.execute({
        sql: `SELECT display_name, username FROM users WHERE username = ? LIMIT 1`,
        args: [username],
      });

      console.log("[UserRepository] DBからの生データ:", result.rows);

      if (result.rows.length === 0) {
        console.log(`❌ [UserRepository] DBに ${username} というユーザーは存在しません`);
        return "Guest";
      }

      const row = result.rows[0];
      const name = String(row.display_name || row.username || "Guest");
      return name;
    } catch (error) {
      console.error("❌ [UserRepository] Error:", error);
      return "Error User";
    }
  }
}