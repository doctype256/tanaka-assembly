// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');

  // 管理パスワードチェック
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Turso からコメント一覧取得
  const result = await db.execute(
    'SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC'
  );

  return NextResponse.json(result.rows);
}
