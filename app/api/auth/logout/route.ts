// /app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  // Cookieを削除して、ログイン状態を解除
  cookieStore.delete('is_admin');
  return NextResponse.json({ message: 'Logged out' });
}