// app/api/cases/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

/**
 * DBクライアントを遅延生成する関数
 * ※ build時には実行されない
 */
function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is undefined");
  }

  return createClient({
    url,
    authToken,
  });
}

/**
 * GET /api/cases
 */
export async function GET() {
  try {
    const client = getClient();

    await client.execute(`
      CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL
      );
    `);

    const result = await client.execute(
      "SELECT id, title, content FROM cases"
    );

    return NextResponse.json(
      {
        ok: true,
        rows: result.rows,
        count: result.rows.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ API /api/cases GET error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cases
 */
export async function POST(request: Request) {
  try {
    const client = getClient();

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと内容が必要です。" },
        { status: 400 }
      );
    }

    const result = await client.execute({
      sql: "INSERT INTO cases (title, content) VALUES (?, ?)",
      args: [String(title), String(content)],
    });

    return NextResponse.json(
      {
        message: "事例データが正常に挿入されました。",
        id: String(result.lastInsertRowid),
        title,
        content,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ API /api/cases POST error:", error);

    return NextResponse.json(
      { error: "データの挿入に失敗しました。" },
      { status: 500 }
    );
  }
}
