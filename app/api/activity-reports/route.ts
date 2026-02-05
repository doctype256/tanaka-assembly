import { NextResponse } from "next/server";
import db from "@/db/client";

// アプリケーション起動時にテーブルが存在しない場合に作成
export async function createTables() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        items TEXT NOT NULL,  -- itemsはJSON形式で保存される前提
        photos TEXT           -- photosもJSON形式で保存
      );
    `);
    console.log("Tables created or already exist.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

// 最初に呼び出してテーブルを作成
createTables();

// GET メソッド: 活動報告の取得
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    // CORS設定
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    if (password) {
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers,
          }
        );
      }
    }

    // データ取得処理
    const result = await db.execute(`
      SELECT id, category, title, year, items, photos
      FROM activity_reports
      ORDER BY year DESC, id DESC;
    `);

    // 結果を整形して返す
    const reports = result.rows.map((row: any) => ({
      id: row.id,
      category: row.category,
      title: row.title,
      year: row.year,
      items: JSON.parse(row.items),  // itemsはJSON形式で保存される前提
      photos: row.photos ? JSON.parse(row.photos) : [],  // photosもJSON形式で保存
    }));

    return new NextResponse(JSON.stringify({ reports }), { headers });
  } catch (error: any) {
    console.error("Error fetching activity reports:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// POST メソッド: 活動報告の保存
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, title, year, items, photos, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!category || !title || !year || !items || !Array.isArray(items)) {
      return new NextResponse(
        JSON.stringify({ error: "必要なデータが不足しています。" }),
        { status: 400 }
      );
    }

    // itemsやphotosをJSON形式で保存する
    const itemsJSON = JSON.stringify(items);
    const photosJSON = photos ? JSON.stringify(photos) : null;

    // データベースに新しい活動報告を保存
    await db.execute(`
      INSERT INTO activity_reports (category, title, year, items, photos)
      VALUES (?, ?, ?, ?, ?);
    `, [category, title, year, itemsJSON, photosJSON]);

    // 新しく追加された活動報告をレスポンスとして返す
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "活動報告が保存されました。",
        data: { category, title, year, items, photos },
      }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving activity report:", error);
    return new NextResponse(
      JSON.stringify({ error: "保存に失敗しました。" }),
      { status: 500 }
    );
  }
}

// DELETE メソッド: 活動報告の削除
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "id is required" }),
        { status: 400 }
      );
    }

    // データベースから活動報告を削除
    await db.execute(`
      DELETE FROM activity_reports WHERE id = ?;
    `, [id]);

    return new NextResponse(
      JSON.stringify({ success: true, message: "活動報告が削除されました。" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting activity report:", error);
    return new NextResponse(
      JSON.stringify({ error: "削除に失敗しました。" }),
      { status: 500 }
    );
  }
}
