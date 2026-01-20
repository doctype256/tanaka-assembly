// /app/admin/records/actions.ts

'use server';

import { getDbClient } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ----------------------------------------------------------------
// 1. 新規作成用 Server Action
// ----------------------------------------------------------------

export async function createRecord(_prevState: any, formData: FormData) { 
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const record_date = formData.get('record_date') as string;
  const category = formData.get('category') as string | null;
  const is_published = formData.get('is_published') === '1' ? 1 : 0; 
  
  if (!title || !content || !record_date) {
    return { success: false, message: '必須項目が不足しています。' };
  }
  
  // created_at 制約エラー対応
  const createdAt = new Date().toISOString(); 
  
  try {
    const db = getDbClient();

    await db.execute({
      sql: `INSERT INTO records (title, content, record_date, category, is_published, created_at) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [title, content, record_date, category, is_published, createdAt],
    });

    revalidatePath('/records');
    revalidatePath('/admin/records');

    // 💡 redirectは必ずtryの最後、かつcatchの直前で呼びます
    // これにより、正常終了時にNext.jsがリダイレクト処理を中断せず実行できます
    redirect('/admin/records?status=created');

  } catch (error: any) {
    // 💡 Next.jsのリダイレクトは内部でエラーをスローするため、
    // エラーメッセージに "NEXT_REDIRECT" が含まれている場合はそのままスローし直します
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error('❌ 記録作成エラー:', error);
    return { success: false, message: 'データベースの書き込みに失敗しました。' };
  }
}

// ----------------------------------------------------------------
// 2. 公開/非公開切り替え用 Server Action
// ----------------------------------------------------------------

export async function togglePublishStatus(recordId: number, currentStatus: number) {
  try {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const db = getDbClient();

    await db.execute({
      sql: `UPDATE records SET is_published = ? WHERE id = ?`,
      args: [newStatus, recordId],
    });

    revalidatePath('/records');
    revalidatePath('/admin/records');

  } catch (error) {
    console.error(`❌ ステータス切り替えエラー (ID: ${recordId}):`, error);
  }
}

// ----------------------------------------------------------------
// 3. 削除用 Server Action
// ----------------------------------------------------------------

export async function deleteRecord(recordId: number) {
  try {
    const db = getDbClient();

    await db.execute({
      sql: `DELETE FROM records WHERE id = ?`,
      args: [recordId],
    });

    revalidatePath('/records');
    revalidatePath('/admin/records');

    return { success: true, message: '記録が正常に削除されました。' };

  } catch (error) {
    console.error(`❌ 記録削除エラー (ID: ${recordId}):`, error);
    return { success: false, message: '記録の削除に失敗しました。' };
  }
}

// ----------------------------------------------------------------
// 4. 記録編集用 Server Action
// ----------------------------------------------------------------

export async function updateRecord(_prevState: any, recordId: number, formData: FormData) {
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const record_date = formData.get('record_date') as string;
  const category = formData.get('category') as string | null;
  const is_published = formData.get('is_published') === '1' ? 1 : 0; 
  
  if (!title || !content || !record_date) {
    return { success: false, message: '必須項目が不足しています。' };
  }
  
  try {
    const db = getDbClient();

    await db.execute({
      sql: `UPDATE records 
            SET title = ?, content = ?, record_date = ?, category = ?, is_published = ? 
            WHERE id = ?`,
      args: [title, content, record_date, category, is_published, recordId],
    });

    revalidatePath('/records');
    revalidatePath('/admin/records');
    revalidatePath(`/records/${recordId}`); 
    revalidatePath(`/admin/records/edit/${recordId}`); 

    return { success: true, message: '活動記録が正常に更新されました。' };

  } catch (error) {
    console.error('❌ 記録更新エラー:', error);
    return { success: false, message: 'データベースの更新に失敗しました。' };
  }
}