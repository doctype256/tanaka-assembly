// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';  // NextRequest, NextResponse をインポート
import db from "@/db/client";

// GETメソッドの処理
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);  // URLオブジェクトを作成
    const article_title = url.searchParams.get("article_title");
    const all = url.searchParams.get("all");
    const password = url.searchParams.get("password");

    // 管理者リクエスト
    if (all === "true") {
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let comments;
      if (typeof db.execute === "function") {
        // Turso (Production)
        const result = await db.execute({
          sql: "SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC",
        });
        comments = result.rows || [];
      } else {
        // SQLite (Local)
        comments = (db as any)
          .prepare("SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC")
          .all();
      }

      return NextResponse.json(comments, { status: 200 });
    }

    // 通常リクエスト（承認済みのみ）
    if (!article_title) {
      return NextResponse.json({ error: "article_title is required" }, { status: 400 });
    }

    const title = Array.isArray(article_title) ? article_title[0] : article_title;

    let comments;
    if (typeof db.execute === "function") {
      const result = await db.execute({
        sql: "SELECT id, article_title, name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC",
        args: [title],
      });
      comments = result.rows || [];
    } else {
      comments = (db as any)
        .prepare("SELECT id, article_title, name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC")
        .all(title);
    }

    return NextResponse.json(comments, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POSTメソッドの処理
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { article_title, name, message } = body;

    if (!article_title || !name || !message) {
      return NextResponse.json({ error: "article_title, name, and message are required" }, { status: 400 });
    }

    if (typeof db.execute === "function") {
      await db.execute({
        sql: "INSERT INTO comments (article_title, name, message) VALUES (?, ?, ?)",
        args: [article_title, name, message],
      });
      console.log("[API] ✓ Comment saved to Turso");
    } else {
      (db as any)
        .prepare("INSERT INTO comments (article_title, name, message) VALUES (?, ?, ?)")
        .run(article_title, name, message);
    }

    return NextResponse.json({ success: true, message: "Comment created" }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCHメソッドの処理
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, approved, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id === undefined || approved === undefined) {
      return NextResponse.json({ error: "id and approved are required" }, { status: 400 });
    }

    if (typeof db.execute === "function") {
      await db.execute({
        sql: "UPDATE comments SET approved = ? WHERE id = ?",
        args: [approved ? 1 : 0, id],
      });
      console.log("[API] ✓ Comment approval updated in Turso");
    } else {
      (db as any)
        .prepare("UPDATE comments SET approved = ? WHERE id = ?")
        .run(approved ? 1 : 0, id);
    }

    return NextResponse.json({ success: true, message: "Comment approval updated" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETEメソッドの処理
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

    if (typeof db.execute === "function") {
      await db.execute({
        sql: "DELETE FROM comments WHERE id = ?",
        args: [id],
      });
      console.log("[API] ✓ Comment deleted from Turso");
    } else {
      (db as any)
        .prepare("DELETE FROM comments WHERE id = ?")
        .run(id);
    }

    return NextResponse.json({ success: true, message: "Comment deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
