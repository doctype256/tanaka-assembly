// lib/cases.ts
import { client } from './turso';

export async function getCases() {
  const result = await client.execute(
    'SELECT id, title, content FROM cases'
  );
  return result.rows;
}
