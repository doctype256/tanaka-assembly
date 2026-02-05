// app/api/comments/approve/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';

export async function POST(req: Request) {
  const { id, approved, password } = await req.json();

  // パスワードチェック
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 承認ステータス更新
  await db.execute({
    sql: 'UPDATE comments SET approved = ? WHERE id = ?',
    args: [approved ? 1 : 0, id],
  });

  return NextResponse.json({ success: true });
}
