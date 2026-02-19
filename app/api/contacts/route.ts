import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { db } from '@/lib/turso';

// ✅ セッションデータの型定義
interface SessionData {
  isAdmin?: boolean;
}

export async function GET(req: Request) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  // ✅ セッション認証
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // お問い合わせ一覧取得
  const result = await db.execute(
    'SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC'
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: Request) { 
  const body = await req.json(); 
  const { name, email, message } = body; 
  await db.execute( 
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message] 
  ); 
  
  return NextResponse.json({ success: true }); 
}