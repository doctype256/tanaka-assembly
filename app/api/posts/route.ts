// app/api/posts/route.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const dummyPosts = [
  {
    id: "1",
    title: "テスト投稿",
    content: "これはテスト用の投稿です",
    createdAt: "2024-01-01T10:00:00"
  },
  {
    id: "2",
    title: "ダミーデータ",
    content: "投稿 API のテストです",
    createdAt: "2024-01-02T12:00:00"
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json(dummyPosts);
  }

  if (req.method === "POST") {
    const newItem = {
      id: String(Date.now()),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    return res.status(200).json(newItem);
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
