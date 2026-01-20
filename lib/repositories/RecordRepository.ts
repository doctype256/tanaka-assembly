import { getDbClient } from '@/lib/db';
import { ActivityRecord } from '../domain/ActivityRecord';

/**
 * 活動記録リポジトリ
 * 役割: データベース(SQLite/LibSQL)への直接的なアクセスを担当します。
 */
export class RecordRepository {
  private db = getDbClient();

  /**
   * 1. IDから1件の記録を取得
   */
  async findById(id: number): Promise<ActivityRecord | null> {
    const result = await this.db.execute({
      sql: `SELECT * FROM records WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) return null;
    return this.mapToEntity(result.rows[0]);
  }

  /**
   * 2. すべての記録を取得（管理者用）
   */
  async findAllForAdmin(): Promise<ActivityRecord[]> {
    const result = await this.db.execute({
      sql: `SELECT * FROM records ORDER BY record_date DESC, id DESC`,
      args: [],
    });
    return result.rows.map(row => this.mapToEntity(row));
  }

  /**
   * 3. 新規作成
   */
  async create(data: {
    title: string;
    content: string;
    recordDate: string;
    isPublished: boolean;
    imageUrl: string | null;
    category: string;
  }): Promise<void> {
    await this.db.execute({
      sql: `INSERT INTO records (title, content, record_date, is_published, image_url, category, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, DATETIME('now', 'localtime'))`,
      args: [
        data.title, 
        data.content, 
        data.recordDate, 
        data.isPublished ? 1 : 0, 
        data.imageUrl, 
        data.category
      ],
    });
  }

  /**
   * 4. 既存データの更新 (🔴 これが不足していたためにエラーが出ていました)
   */
  async update(id: number, data: {
    title: string;
    content: string;
    recordDate: string;
    isPublished: boolean;
    imageUrl: string | null;
    category: string;
  }): Promise<void> {
    await this.db.execute({
      sql: `UPDATE records 
            SET title = ?, content = ?, record_date = ?, is_published = ?, image_url = ?, category = ?
            WHERE id = ?`,
      args: [
        data.title, 
        data.content, 
        data.recordDate, 
        data.isPublished ? 1 : 0, 
        data.imageUrl, 
        data.category, 
        id
      ],
    });
  }

  /**
   * 5. 公開状態の単独更新
   */
  async updateStatus(id: number, isPublished: boolean): Promise<void> {
    await this.db.execute({
      sql: `UPDATE records SET is_published = ? WHERE id = ?`,
      args: [isPublished ? 1 : 0, id],
    });
  }

  /**
   * 6. 削除
   */
  async delete(id: number): Promise<void> {
    await this.db.execute({
      sql: `DELETE FROM records WHERE id = ?`,
      args: [id],
    });
  }

  /**
   * DBの行データをEntityに変換
   */
  private mapToEntity(row: any): ActivityRecord {
    return new ActivityRecord(
      Number(row.id),
      String(row.title || '無題'),
      String(row.content || ''),
      String(row.record_date || ''),
      Number(row.is_published) === 1,
      row.image_url ? String(row.image_url) : null,
      String(row.category || '未分類')
    );
  }
}