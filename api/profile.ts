import type { VercelRequest, VercelResponse } from '@vercel/node';

let dummyProfile = {
  name: "テスト太郎",
  job: "テストエンジニア",
  description: "これはテスト用プロフィールです"
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json(dummyProfile);
  }

  if (req.method === "POST") {
    dummyProfile = { ...dummyProfile, ...req.body };
    return res.status(200).json(dummyProfile);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
