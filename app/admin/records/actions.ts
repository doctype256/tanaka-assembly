"use server";

import { AdminRecordService } from '@/lib/services/AdminRecordService';
import { revalidatePath } from 'next/cache';

const service = new AdminRecordService();

/**
 * 1. 新規作成アクション
 */
export async function createRecord(prevState: any, formData: FormData) {
  try {
    await service.createRecord(formData);
    revalidatePath('/admin/records');
    return { success: true, message: "記録を作成しました" };
  } catch (error) {
    console.error("❌ createRecord error:", error);
    return { success: false, message: "作成に失敗しました" };
  }
}

/**
 * 2. 更新アクション
 */
export async function updateRecord(prevState: any, formData: FormData) {
  try {
    await service.updateRecord(formData);
    revalidatePath('/admin/records');
    const id = formData.get('id');
    if (id) revalidatePath(`/admin/records/edit/${id}`);
    
    return { success: true, message: "記録を更新しました" };
  } catch (error) {
    console.error("❌ updateRecord error:", error);
    return { success: false, message: "更新に失敗しました" };
  }
}

/**
 * 3. 状態切り替えアクション
 */
export async function togglePublishStatus(id: number, isPublic: boolean) {
  try {
    // ログを出して実行を確認
    console.log(`🚀 togglePublishStatus 呼び出し: ID=${id}, 新ステータス=${isPublic}`);

    // DBのカラム型に合わせて 1/0 に変換
    const statusValue = isPublic ? 1 : 0;
    
    // 型エラー回避のための unknown を挟んだ型変換
    await service.toggleStatus(id, (statusValue as unknown) as boolean);

    // 一覧画面のキャッシュを強制更新
    revalidatePath('/admin/records');
    console.log(`✅ ステータス更新完了 & キャッシュクリア`);

    // 明示的にオブジェクトを返して Promise<void> を期待する箇所との整合性をとる
    return { success: true };
  } catch (error) {
    console.error("❌ togglePublishStatus error:", error);
    return { success: false };
  }
}

/**
 * 4. 削除アクション
 */
export async function deleteRecord(id: number) {
  try {
    await service.deleteRecord(id);
    revalidatePath('/admin/records');
    return { success: true, message: "削除しました" };
  } catch (error) {
    console.error("❌ deleteRecord error:", error);
    return { success: false, message: "削除失敗" };
  }
}