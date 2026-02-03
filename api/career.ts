// api/career.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../db/client";


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== GET: 経歴一覧取得（パスワード不要 - 公開情報） =====
  if (req.method === "GET") {
    try {
      // パスワードが提供されている場合は認証確認（将来の拡張用）
      const { password } = req.query;
      if (password) {
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (password !== adminPassword) {
          return res.status(401).json({ error: "Unauthorized" });
        }
      }

      let careers;

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        const result = await (db as any).execute({
          sql: "SELECT id, year, month, Content FROM career ORDER BY year DESC, month DESC",
        });
        careers = result.results || result.rows || [];
      } else {
        // SQLite (Local)
        careers = (db as any)
          .prepare("SELECT id, year, month, Content FROM career ORDER BY year DESC, month DESC")
          .all();
      }

      return res.status(200).json(careers);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== POST: 経歴追加（管理者のみ） =====
  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { year, month, Content, password } = body;

      // 管理者認証
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!year || !month || !Content) {
        return res.status(400).json({
          error: "year, month, and Content are required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        await (db as any).execute({
          sql: "INSERT INTO career (year, month, Content) VALUES (?, ?, ?)",
          args: [year, month, Content],
        });
      } else {
        // SQLite (Local)
        (db as any)
          .prepare("INSERT INTO career (year, month, Content) VALUES (?, ?, ?)")
          .run(year, month, Content);
      }

      return res.status(201).json({ success: true, message: "Career added" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== DELETE: 経歴削除（管理者のみ） =====
  if (req.method === "DELETE") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { id, password } = body;

      // 管理者認証
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        await (db as any).execute({
          sql: "DELETE FROM career WHERE id = ?",
          args: [id],
        });
      } else {
        // SQLite (Local)
        (db as any).prepare("DELETE FROM career WHERE id = ?").run(id);
      }

      return res.status(200).json({ success: true, message: "Career deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
