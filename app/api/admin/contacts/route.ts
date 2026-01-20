import { NextResponse } from 'next/server';
// 🟢 自作の db.ts からクライアント取得関数をインポート
import { getDbClient } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // 🟢 関数の「中」で実行。これによりビルド時のエラーを回避
    const client = getDbClient();

    // 降順でお問い合わせを取得
    const result = await client.execute("SELECT * FROM contacts ORDER BY created_at DESC");
    
    // rowsがundefinedの場合に備えて空配列を保証し、プレーンな配列として抽出
    const contacts = result.rows ? Array.from(result.rows) : [];
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Fetch contacts error:", error);
    // エラーが起きても 500エラーと一緒に「空配列」を返すことでフロントのクラッシュを防ぐ
    return NextResponse.json([], { status: 500 });
  }
}