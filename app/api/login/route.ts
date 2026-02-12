import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({ 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!, 
});

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 3 * 60 * 1000; // 3分
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  // IPアドレスを取得（x-forwarded-for ヘッダーから）
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const now = Date.now();

  try {
    // 必要なテーブルがなければ作成
    await db.execute(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        ip TEXT PRIMARY KEY,
        failed_count INTEGER DEFAULT 0,
        lock_until INTEGER DEFAULT 0
      );
    `);

    // 現在の試行状況を取得
    const result = await db.execute({
      sql: 'SELECT failed_count, lock_until FROM login_attempts WHERE ip = ?',
      args: [ip],
    });

    const row = result.rows[0];
    const failedCount = row ? Number(row.failed_count) : 0;
    const lockUntil = row ? Number(row.lock_until) : 0;

    if (lockUntil && now < lockUntil) {
      return NextResponse.json(
        { message: 'ロック中です。しばらくしてから再試行してください。' },
        { status: 429 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      const newFailedCount = failedCount + 1;
      const newLockUntil =
        newFailedCount >= MAX_ATTEMPTS ? now + LOCK_TIME : 0;

      await db.execute({
        sql: `
          INSERT INTO login_attempts (ip, failed_count, lock_until)
          VALUES (?, ?, ?)
          ON CONFLICT(ip) DO UPDATE SET
            failed_count = excluded.failed_count,
            lock_until = excluded.lock_until
        `,
        args: [ip, newFailedCount, newLockUntil],
      });

      const msg =
        newFailedCount >= MAX_ATTEMPTS
          ? '3回間違えたので3分間ロックされました'
          : 'パスワードが間違っています';

      return NextResponse.json({ message: msg }, { status: 401 });
    }

    // 成功時は記録を削除
    await db.execute({
      sql: 'DELETE FROM login_attempts WHERE ip = ?',
      args: [ip],
    });

    return NextResponse.json({ message: 'ログイン成功！' });
  } catch (err) {
    console.error('ログインAPIエラー:', err);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
