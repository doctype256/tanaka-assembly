// /app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';
import { cookies } from 'next/headers';

// データベース接続の設定
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    // デバック用
  // 今、画面で入力したパスワードをその場でハッシュ化してみる
  const inputPasswordHash = await bcrypt.hash(password, 10);
  
  console.log("-----------------------------------------");
  console.log("今入力された生パスワード:", password);
  console.log("入力値をハッシュ化した結果:", inputPasswordHash);
  // --- 【ここまで追加】 ---

    // 1. データベースからユーザーを取得
    const result = await client.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: [username]
    });

    const user = result.rows[0];
    console.log("--- ログイン試行のデバッグ ---");
    console.log("DBから取得したユーザー名:", user?.username);
    console.log("DBから取得したハッシュ:", user?.password_hash);
    console.log("----------------------------");

    // ユーザーが存在しない場合
    if (!user) {
      return NextResponse.json({ message: '認証に失敗しました' }, { status: 401 });
    }

    // 2. パスワードの照合
    // bcrypt.compare(入力された生パスワード, DB内のハッシュ値)
    const isMatch = await bcrypt.compare(password, user.password_hash as string);

    if (isMatch) {
      // 3. ログイン成功：ブラウザにログイン済みのCookieをセットする
      const cookieStore = await cookies();
      cookieStore.set('is_admin', 'true', {
        httpOnly: true,     // JavaScriptから操作不能にしてセキュリティ向上
        secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPSのみ
        maxAge: 60 * 60 * 24, // 24時間有効
        path: '/',
      });

      return NextResponse.json({ message: 'Success' });
    } else {
      // パスワードが一致しない場合
      return NextResponse.json({ message: '認証に失敗しました' }, { status: 401 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}