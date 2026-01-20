import { RecordRepository } from '../repositories/RecordRepository';
// 🔴 FileStorage は Vercel では動かないため使用を停止します
// import { FileStorage } from '../infrastructure/FileStorage';
import { revalidatePath } from 'next/cache';

/**
 * 管理者記録サービス
 * 役割: 作成、更新、削除、ステータス変更のビジネスロジックを統括
 */
export class AdminRecordService {
  private repo = new RecordRepository();
  // private storage = new FileStorage(); // 🔴 削除またはコメントアウト

  /**
   * 記録の新規作成
   */
  async createRecord(formData: FormData): Promise<void> {
    const title = String(formData.get('title') || "");
    const content = String(formData.get('content') || "");
    const record_date = String(formData.get('record_date') || "");
    const category = String(formData.get('category') || "未分類");
    const is_published = formData.get('is_published') === '1' || formData.get('is_published') === 'on' ? 1 : 0;

    // 🟢 修正ポイント: ファイルではなく、Base64文字列を受け取る
    // useNewRecord.ts の handleSubmit でセットした値です
    const imageUrl = formData.get('image') as string;

    await this.repo.create({
      title,
      content,
      recordDate: record_date,
      isPublished: is_published === 1,
      imageUrl, // 🟢 文字列をそのままDBへ
      category
    });

    this.refreshCache();
  }

  /**
   * 既存記録の更新
   */
  async updateRecord(formData: FormData): Promise<void> {
    const id = Number(formData.get('id'));
    const title = String(formData.get('title') || "");
    const content = String(formData.get('content') || "");
    const record_date = String(formData.get('record_date') || "");
    const category = String(formData.get('category') || "未分類");
    const is_published = formData.get('is_published') === '1' || formData.get('is_published') === 'on' ? 1 : 0;

    // 🟢 修正ポイント: 
    // 新しい画像があればそれ(Base64)を使い、なければ既存のURLを維持する
    const newImageUrl = formData.get('image') as string;
    const existingImageUrl = formData.get('existing_image_url') as string | null;
    
    // 画像が送られてきていれば更新、なければそのまま
    const finalImageUrl = (newImageUrl && newImageUrl.startsWith('data:')) 
      ? newImageUrl 
      : existingImageUrl;

    await this.repo.update(id, {
      title,
      content,
      recordDate: record_date,
      isPublished: is_published === 1,
      imageUrl: finalImageUrl,
      category
    });

    this.refreshCache();
  }

  /**
   * 記録の削除
   */
  async deleteRecord(id: number): Promise<void> {
    const record = await this.repo.findById(id);
    if (!record) throw new Error("対象が見つかりません");

    // 🟢 修正ポイント: 文字列データなのでファイル削除処理は不要
    // if (record.imageUrl) await this.storage.delete(record.imageUrl);
    
    await this.repo.delete(id);
    this.refreshCache();
  }

  /**
   * 公開状態の切り替え
   */
  async toggleStatus(id: number, targetStatus: boolean): Promise<void> {
    await this.repo.updateStatus(id, targetStatus);
    this.refreshCache();
  }

  private refreshCache() {
    revalidatePath('/admin/records');
    revalidatePath('/admin');
  }
}