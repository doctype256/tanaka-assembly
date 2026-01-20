// lib/turso.ts
import { createClient } from '@libsql/client';

export const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});
