// app/admin/records/page.tsx
export const dynamic = 'force-dynamic';

import { RecordRepository } from '@/lib/repositories/RecordRepository';
import { AuthService } from '@/lib/services/AuthService';
import AdminRecordsClient from './AdminRecordsClient';

export default async function AdminRecordsPage() {
  const authService = new AuthService();
  const recordRepo = new RecordRepository();

  // 1. サーバーサイドでデータを取得
  const displayName = await authService.getCurrentDisplayName();
  const rawRecords = await recordRepo.findAllForAdmin();

  // 2. Client Componentsへ渡すためにデータを「純粋なオブジェクト」に変換
  const records = rawRecords.map(record => ({
    id: record.id,
    title: record.title,
    content: record.content,
    recordDate: record.recordDate,
    isPublic: record.isPublic, 
    imageUrl: record.imageUrl,
    hasImage: record.hasImage,
    category: record.category,
  }));

  // 3. 全ての表示を Client 側に委譲する
  return <AdminRecordsClient initialUserName={displayName} records={records} />;
}