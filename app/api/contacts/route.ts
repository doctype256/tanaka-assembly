// [project]/app/api/contacts/route.ts

import { NextRequest, NextResponse } from 'next/server';  // `import type` を通常のインポートに変更
import db from "@/db/client";

// CORS設定
const setCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*");  // 任意のドメインからアクセス可能
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");  // 許可するHTTPメソッド
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");  // 許可するヘッダー
};

// OPTIONSメソッドへの対応（CORSプリフライトリクエスト）
export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.json({});  // 空のレスポンスを返す
  setCorsHeaders(res);  // CORSヘッダーを設定
  return res;  // status(200) は不要、NextResponse.json() はデフォルトで200ステータスを返す
}

// GETメソッド
export async function GET(req: NextRequest) {
  try {
    // URLSearchParams から password を取得
    const password = req.nextUrl.searchParams.get('password'); // get() メソッドで取得
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // 文字列として設定

    // パスワードを文字列として比較
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let contacts;

    // データベースからお問い合わせを取得
    if (typeof (db as any).execute === "function") {
      const result = await (db as any).execute({
        sql: "SELECT id, name, furigana, email, message, created_at FROM contacts ORDER BY created_at DESC",
      });
      contacts = result.results || result.rows || [];
    } else {
      contacts = (db as any)
        .prepare("SELECT id, name, furigana, email, message, created_at FROM contacts ORDER BY created_at DESC")
        .all();
    }

    const res = NextResponse.json(contacts); // レスポンスには200ステータスコードがデフォルト
    setCorsHeaders(res);  // CORSヘッダーを設定
    return res;
  } catch (err: any) {
    const res = NextResponse.json({ error: err.message }, { status: 500 });
    setCorsHeaders(res);  // CORSヘッダーを設定
    return res;
  }
}

// POSTメソッド
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, furigana, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email, and message are required" }, { status: 400 });
    }

    if (typeof (db as any).execute === "function") {
      await (db as any).execute({
        sql: "INSERT INTO contacts (name, furigana, email, message) VALUES (?, ?, ?, ?)",
        args: [name, furigana || null, email, message],
      });
      console.log("[API] ✓ Contact saved to Turso");
    } else {
      (db as any)
        .prepare("INSERT INTO contacts (name, furigana, email, message) VALUES (?, ?, ?, ?)")
        .run(name, furigana || null, email, message);
    }

    const res = NextResponse.json({ success: true, message: "Contact created" }, { status: 201 });
    setCorsHeaders(res);  // CORSヘッダーを設定
    return res;
  } catch (err: any) {
    const res = NextResponse.json({ error: err.message }, { status: 500 });
    setCorsHeaders(res);  // CORSヘッダーを設定
    return res;
  }
}

// DELETEメソッド
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (typeof (db as any).execute === "function") {
      await (db as any).execute({
        sql: "DELETE FROM contacts WHERE id = ?",
        args: [id],
      });
      console.log("[API] ✓ Contact deleted from Turso");
    } else {
      (db as any)
        .prepare("DELETE FROM contacts WHERE id = ?")
        .run(id);
    }

    const res = NextResponse.json({ success: true, message: "Contact deleted" }, { status: 200 });
    setCorsHeaders(res);  // CORSヘッダーを設定
    return res;
  } catch (err: any) {
    const res = NextResponse.json({ error: err.message }, { status: 500 });
    setCorsHeaders(res);  // CORSヘッダーを設定
    return res;
  }
}
