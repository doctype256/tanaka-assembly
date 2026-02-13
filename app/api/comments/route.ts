import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { db } from '@/lib/turso';

// ✅ セッションデータの型定義
interface SessionData {
  isAdmin?: boolean;
}

// GET: コメント一覧（管理者のみ）
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const article_title = searchParams.get('article_title'); // 特定の記事用
  const password = searchParams.get('password');

  // 管理者かどうか判定
  const isAdmin = password === process.env.ADMIN_PASSWORD;

  try {
    let sql = '';
    let args = [];

    if (isAdmin) {
      // 【管理者】パスワードがある場合は、すべてのコメントを返す
      sql = 'SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC';
      args = [];
    } else {
      // 【一般ユーザー】パスワードがない場合は、承認済み (approved = 1) のみ返す
      // 特定の記事タイトル(article_title)が指定されている場合は、その記事の分だけ
      if (article_title) {
        sql = 'SELECT name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC';
        args = [article_title];
      } else {
        // 記事指定がない場合（あまりないケースですが念のため）
        sql = 'SELECT name, message, created_at FROM comments WHERE approved = 1 ORDER BY created_at DESC';
        args = [];
      }
    }

    const result = await db.execute(sql, args);
    return NextResponse.json(result.rows);

  } catch (err) {
    console.error('[API] コメント取得エラー:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
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

// 既存の GET, POST, PATCH の下に追加

export async function DELETE(req: Request) {
  try {
    // 1. リクエストの中身（JSON）を読み取る
    const body = await req.json();
    const { id, password } = body;

    // 2. サーバーに設定されているパスワード(環境変数)と比較
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      console.error("削除権限なし: パスワードが一致しません");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
    }

    // 3. データベースから削除を実行
    await db.execute({
      sql: 'DELETE FROM comments WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[API] コメント削除エラー:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
