import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// 🟢 createClient は削除し、getDbClient をインポート
import { getDbClient } from '@/lib/db'; 
import { cookies } from 'next/headers';

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 🟢 関数の中でクライアントを取得
    const client = getDbClient(); 

    const { username, password } = await request.json();

    // 🟢 【デバッグ】
    const debugResult = await client.execute({
      sql: "SELECT * FROM users WHERE id = 1",
      args: []
    });
    
    // ...（以下、既存のロジックはそのまま client を使ってください）
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 DBのID:1 ユーザー情報チェック:");
    if (debugResult.rows.length > 0) {
      console.table(debugResult.rows[0]);
    } else {
      console.log("❌ ID:1 のユーザーが見つかりません！");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const result = await client.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: [username]
    });

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: '認証に失敗しました' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash as string);

    if (isMatch) {
      const cookieStore = await cookies();
      
      cookieStore.set('username', String(user.username), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      cookieStore.set('is_admin', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return NextResponse.json({ message: 'Success' });
    } else {
      return NextResponse.json({ message: '認証に失敗しました' }, { status: 401 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}