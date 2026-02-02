// api/profile.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../../db/client.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== GET: プロフィール取得（パスワード不要 - 公開情報） =====
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

      let profile;

      if (typeof (db as any).execute === "function") {
        // Turso (Production) - 最新（ID最大）のプロフィールを取得
        const result = await (db as any).execute({
          sql: "SELECT * FROM profile ORDER BY id DESC LIMIT 1",
        });
        profile = result.results?.[0] || result.rows?.[0];
        console.log('[Profile API] Turso result:', result);
      } else {
        // SQLite (Local) - 最新（ID最大）のプロフィールを取得
        profile = (db as any).prepare("SELECT * FROM profile ORDER BY id DESC LIMIT 1").get();
      }

      console.log('[Profile API] Retrieved profile:', profile);

      if (!profile) {
        console.log('[Profile API] No profile found in database');
        return res.status(404).json({ error: "Profile not found" });
      }

      console.log('[Profile API] Returning profile with IMG_URL:', profile.IMG_URL);
      return res.status(200).json(profile);
    } catch (err: any) {
      console.error('[Profile API] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== POST: プロフィール保存（管理者のみ） =====
  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { Name, IMG_URL, birthday, From, Family, Job, hobby, password } =
        body;

      console.log('[Profile API POST] Request body:', { Name, IMG_URL, birthday, From, Family, Job, hobby });

      // 管理者認証
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        console.log('[Profile API POST] Unauthorized password');
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!Name || !IMG_URL) {
        console.log('[Profile API POST] Missing required fields:', { Name, IMG_URL });
        return res.status(400).json({
          error: "Name and IMG_URL are required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production) - 常に新規挿入
        console.log('[Profile API POST] Inserting new profile (Turso)');
        await (db as any).execute({
          sql: "INSERT INTO profile (Name, IMG_URL, birthday, From, Family, Job, hobby) VALUES (?, ?, ?, ?, ?, ?, ?)",
          args: [Name, IMG_URL, birthday, From, Family, Job, hobby],
        });
      } else {
        // SQLite (Local) - 常に新規挿入
        console.log('[Profile API POST] Inserting new profile (SQLite)');
        (db as any)
          .prepare(
            "INSERT INTO profile (Name, IMG_URL, birthday, From, Family, Job, hobby) VALUES (?, ?, ?, ?, ?, ?, ?)"
          )
          .run(Name, IMG_URL, birthday, From, Family, Job, hobby);
      }

      console.log('[Profile API POST] Profile saved successfully');
      return res.status(200).json({ success: true, message: "Profile saved" });
    } catch (err: any) {
      console.error('[Profile API POST] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
