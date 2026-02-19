import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { db } from '@/lib/turso';

// ✅ セッションデータの型定義
interface SessionData {
  isAdmin?: boolean;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const articleTitle = searchParams.get('article_title');
  const all = searchParams.get('all');

  // ★ all=true のときは article_title を要求しない
  if (!all && !articleTitle) {
    return NextResponse.json({ error: 'Missing article_title' }, { status: 400 });
  }

  // ★ 管理画面用：全件取得
  if (all) {
    const result = await db.execute(
      'SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  }

  // ★ 一般公開用：記事ごとの approved=1 のコメント
  const result = await db.execute(
    'SELECT id, article_title, name, message, approved, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC',
    [articleTitle]
  );

  return NextResponse.json(result.rows);
}



// POST: コメント投稿（誰でもOK）
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

// PATCH: コメントの承認切り替え（管理者のみ）
export async function PATCH(req: Request) {
  try {
    const res = new NextResponse();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, approved } = body;

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
