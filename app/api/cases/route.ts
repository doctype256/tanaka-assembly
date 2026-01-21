// app/api/cases/route.ts
import { NextResponse } from "next/server";
import { getDbClient } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/cases
 */
export async function GET() {
  try {
    const client = getDbClient();

    // 🟢 imageカラムを追加してテーブルを作成/更新
    await client.execute(`
      CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT
      );
    `);

    // 🟢 imageも含めて取得
    const result = await client.execute(
      "SELECT id, title, content, image FROM cases ORDER BY id DESC"
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
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

/**
 * POST /api/cases
 */
export async function POST(request: Request) {
  try {
    const client = getDbClient();

    const body = await request.json();
    // 🟢 フロントエンドから送られてくる image (Base64文字列) を受け取る
    const { title, content, image } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと内容が必要です。" },
        { status: 400 }
      );
    }

    // 🟢 SQLに image カラムを追加
    const result = await client.execute({
      sql: "INSERT INTO cases (title, content, image) VALUES (?, ?, ?)",
      args: [String(title), String(content), image ? String(image) : null],
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
    return NextResponse.json({ error: "データの挿入に失敗しました。" }, { status: 500 });
  }
}