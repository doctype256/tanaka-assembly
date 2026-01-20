import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET() {
  try {
    // 1. 実績テーブルの件数を取得
    const recordsResult = await client.execute("SELECT COUNT(*) as count FROM records");
    // 2. お問い合わせテーブルの件数を取得
    const contactsResult = await client.execute("SELECT COUNT(*) as count FROM contacts");

    return NextResponse.json({
      records: Number(recordsResult.rows[0].count),
      contacts: Number(contactsResult.rows[0].count),
    });
  } catch (error) {
    return NextResponse.json({ records: 0, contacts: 0 }, { status: 500 });
  }
}