// api/comments.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../db/client.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== GET: 記事のコメント一覧を取得 =====
  if (req.method === "GET") {
    try {
      const { article_title, all, password } = req.query;

      // 管理者リクエスト
      if (all === "true") {
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (password !== adminPassword) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        let comments;
        if (typeof (db as any).execute === "function") {
          // Turso (Production)
          const result = await (db as any).execute({
            sql: "SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC",
          });
          comments = result.results || result.rows || [];
        } else {
          // SQLite (Local)
          comments = (db as any)
            .prepare(
              "SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC"
            )
            .all();
        }

        return res.status(200).json(comments);
      }

      // 通常リクエスト（承認済みのみ）
      if (!article_title) {
        return res.status(400).json({ error: "article_title is required" });
      }

      let comments;

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        const result = await (db as any).execute({
          sql: "SELECT id, article_title, name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC",
          args: [article_title],
        });
        comments = result.results || result.rows || [];
      } else {
        // SQLite (Local)
        comments = (db as any)
          .prepare(
            "SELECT id, article_title, name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC"
          )
          .all(article_title);
      }

      return res.status(200).json(comments);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== POST: 新しいコメントを作成 =====
  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { article_title, name, message } = body;

      if (!article_title || !name || !message) {
        return res.status(400).json({
          error: "article_title, name, and message are required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        const result = await (db as any).execute({
          sql: "INSERT INTO comments (article_title, name, message) VALUES (?, ?, ?)",
          args: [article_title, name, message],
        });
        console.log("[API] ✓ Comment saved to Turso");
      } else {
        // SQLite (Local)
        (db as any)
          .prepare(
            "INSERT INTO comments (article_title, name, message) VALUES (?, ?, ?)"
          )
          .run(article_title, name, message);
      }

      return res.status(201).json({ success: true, message: "Comment created" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== PATCH: 承認状態を更新 =====
  if (req.method === "PATCH") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { id, approved, password } = body;

      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (id === undefined || approved === undefined) {
        return res.status(400).json({
          error: "id and approved are required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        await (db as any).execute({
          sql: "UPDATE comments SET approved = ? WHERE id = ?",
          args: [approved ? 1 : 0, id],
        });
        console.log("[API] ✓ Comment approval updated in Turso");
      } else {
        // SQLite (Local)
        (db as any)
          .prepare("UPDATE comments SET approved = ? WHERE id = ?")
          .run(approved ? 1 : 0, id);
      }

      return res.status(200).json({ success: true, message: "Comment approval updated" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== DELETE: コメント削除 =====
  if (req.method === "DELETE") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { id, password } = body;

      // 簡易的な管理者認証（環境変数から取得）
      const adminPassword =
        process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!id) {
        return res.status(400).json({
          error: "id is required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        await (db as any).execute({
          sql: "DELETE FROM comments WHERE id = ?",
          args: [id],
        });
        console.log("[API] ✓ Comment deleted from Turso");
      } else {
        // SQLite (Local)
        (db as any)
          .prepare("DELETE FROM comments WHERE id = ?")
          .run(id);
      }

      return res
        .status(200)
        .json({ success: true, message: "Comment deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
