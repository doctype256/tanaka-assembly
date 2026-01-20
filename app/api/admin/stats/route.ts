// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = getDbClient();

    // 🟢 ポイント1: SQLの別名(as)をService側の変数名と一致させる
    // Service側が data.records / data.contacts を参照しているため
    const result = await client.execute(`
      SELECT 
        (SELECT COUNT(*) FROM cases) as records, 
        (SELECT COUNT(*) FROM contacts) as contacts
    `);

    // 🟢 ポイント2: データの型変換
    // Turso(Libsql)の数値は内部的にBigIntとして扱われることがあり、
    // そのままではJSONとして送れない、または文字列になる場合があるためNumber()で囲みます。
    const statsData = {
      records: Number(result.rows[0]?.records || 0),
      contacts: Number(result.rows[0]?.contacts || 0)
    };

    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Fetch stats error:", error);
    // 失敗時もUIを壊さないよう、Service側と同じ構造の初期値を返す
    return NextResponse.json({ records: 0, contacts: 0 }, { status: 500 });
  }
}