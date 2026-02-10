// directory: db/repository/ConsultationRepository.ts
import db from '../client'; // default export を db としてインポート

export class ConsultationRepository {
  /**
   * 相談データをDBに保存する
   */
  static async create(data: {
    target_type: string;
    place_type: string;
    content_type: string;
    needs_reply: boolean;
    email: string;
    message: string;
    ip_hash: string;
    user_agent: string;
    referer_url: string;
  }) {
    const query = `
      INSERT INTO consultations (
        target_type, place_type, content_type, needs_reply, 
        email, message, ip_hash, user_agent, referer_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // インポート名に合わせて db.execute を使用
    return await db.execute({
      sql: query,
      args: [
        data.target_type, 
        data.place_type, 
        data.content_type, 
        data.needs_reply ? 1 : 0,
        data.email, 
        data.message, 
        data.ip_hash, 
        data.user_agent, 
        data.referer_url
      ],
    });
  }

  /**
   * 24時間以内の同一IPハッシュによる投稿があるか確認する
   */
  static async checkLimit(ipHash: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count FROM consultations 
      WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')
    `;
    const result = await db.execute({
      sql: query,
      args: [ipHash],
    });
    const count = Number(result.rows[0]?.count || 0);
    return count > 0;
  }

  /**
   * 1年以上経過した古いデータを削除する
   */
  static async deleteExpired() {
    return await db.execute("DELETE FROM consultations WHERE created_at < datetime('now', '-365 days')");
  }

  /**
   * 管理者用：全件取得
   */
  static async findAll() {
    return await db.execute("SELECT * FROM consultations ORDER BY created_at DESC");
  }

  /**
   * ステータスを更新する
   */
  static async updateStatus(id: number, status: 'unread' | 'processing' | 'completed') {
    const query = `UPDATE consultations SET status = ? WHERE id = ?`;
    return await db.execute({
      sql: query,
      args: [status, id],
    });
  }

  /**
   * 特定の相談を削除する
   */
  static async delete(id: number) {
    const query = `DELETE FROM consultations WHERE id = ?`;
    return await db.execute({
      sql: query,
      args: [id],
    });
  }

  /**
   * 管理者メモを更新する
   */
  static async updateAdminMemo(id: number, memo: string) {
    const query = `UPDATE consultations SET admin_memo = ? WHERE id = ?`;
    return await db.execute({
      sql: query,
      args: [memo, id],
    });
  }
}