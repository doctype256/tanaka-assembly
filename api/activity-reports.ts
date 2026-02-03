export default async function handler(req: any, res: any) {
  try {
    res.status(200).json([]);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch activity reports" });
  }
}
