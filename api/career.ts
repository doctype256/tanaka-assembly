import type { VercelRequest, VercelResponse } from '@vercel/node';

let dummyCareer = [
  { id: "1", year: "2020", text: "テスト会社に入社" },
  { id: "2", year: "2022", text: "テスト部署に異動" }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json(dummyCareer);
  }

  if (req.method === "POST") {
    const newItem = {
      id: String(Date.now()),
      ...req.body
    };
    dummyCareer.push(newItem);
    return res.status(200).json(newItem);
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
