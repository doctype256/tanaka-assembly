// app/api/contacts/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';

export async function POST(req: Request) {
  const { id, password } = await req.json();

  // パスワードチェック
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // お問い合わせ削除
  await db.execute({
    sql: 'DELETE FROM contacts WHERE id = ?',
    args: [id],
  });

  return NextResponse.json({ success: true });
}
