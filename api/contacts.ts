import type { VercelRequest, VercelResponse } from '@vercel/node';

// テスト用のダミーデータ
const dummyContacts = [
  {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    message: "これはテストのお問い合わせです",
    createdAt: "2024-01-01T12:00:00"
  },
  {
    id: "2",
    name: "山田太郎",
    email: "yamada@example.com",
    message: "ダミーデータです",
    createdAt: "2024-01-02T15:30:00"
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // GET: 全件取得
  if (req.method === 'GET') {
    return res.status(200).json(dummyContacts);
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

  // 未対応メソッド
  return res.status(405).json({ error: 'Method not allowed' });
}
