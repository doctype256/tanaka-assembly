import type { VercelRequest, VercelResponse } from '@vercel/node';

const dummyComments = [
  { id: "1", name: "テスト太郎", message: "これはテストコメントです", createdAt: "2024-01-01" },
  { id: "2", name: "山田花子", message: "ダミーデータです", createdAt: "2024-01-02" }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET: 全件取得
  if (req.method === 'GET') {
    return res.status(200).json(dummyComments);
  }

  // POST: 新規追加（実際には保存しない）
  if (req.method === 'POST') {
    const body = req.body;
    const newItem = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString()
    };
    return res.status(200).json(newItem);
  }

  // DELETE: 削除（実際には削除しない）
  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
