// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await db.execute(
    'SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC'
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { article_title, name, message } = body;

    if (!article_title || !name || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db.execute(
      'INSERT INTO comments (article_title, name, message, approved, created_at) VALUES (?, ?, ?, ?, ?)',
      [article_title, name, message, 0, now]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[API] コメント投稿エラー:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// app/api/comments/route.ts
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, approved, password } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (typeof id !== 'number' || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await db.execute(
      'UPDATE comments SET approved = ? WHERE id = ?',
      [approved ? 1 : 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] コメント承認切り替えエラー:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

