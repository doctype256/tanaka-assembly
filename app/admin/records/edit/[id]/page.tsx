// app/admin/records/edit/[id]/page.tsx
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getDbClient } from '@/lib/db';
import { AuthService } from '@/lib/services/AuthService';
import EditRecordClient from './EditRecordClient';

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authService = new AuthService();
  const db = getDbClient();

  const [displayName, result] = await Promise.all([
    authService.getCurrentDisplayName(),
    db.execute({
      sql: `SELECT id, title, content, record_date, category, is_published, image_url 
            FROM records WHERE id = ?`,
      args: [Number(id)],
    })
  ]);

  const row = result.rows[0];
  if (!row) notFound();

  // 🟢 修正ポイント：既存の EditFormStatus が期待するプロパティ名（スネークケース）に合わせる
  const record = {
    id: Number(row.id),
    title: String(row.title),
    content: String(row.content),
    record_date: String(row.record_date), // recordDate から変更
    category: row.category ? String(row.category) : null,
    is_published: Number(row.is_published), // isPublished から変更
    image_url: row.image_url ? String(row.image_url) : null, // imageUrl から変更
  };

  return <EditRecordClient record={record} displayName={displayName} />;
}