import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET() {
  try {
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