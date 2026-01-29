import type { VercelRequest, VercelResponse } from '@vercel/node';

const dummyPdfList = [
  { id: "1", title: "テストPDF", url: "/dummy/test1.pdf" },
  { id: "2", title: "ダミー資料", url: "/dummy/test2.pdf" }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json(dummyPdfList);
  }

  if (req.method === "POST") {
    const newItem = {
      id: String(Date.now()),
      ...req.body
    };
    return res.status(200).json(newItem);
  }

  if (req.method === "DELETE") {
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
