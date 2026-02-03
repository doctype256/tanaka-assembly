// app/api/activity-reports/route.ts
import { NextResponse } from 'next/server';
import db from "@/db/client";

// export default ではなく、メソッド名の関数にする
export async function GET() {
  try {
    // データの取得処理など
    // const data = await db...
    
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POSTが必要な場合はこれも追加
export async function POST(request: Request) {
  const body = await request.json();
  // 保存処理など
  return NextResponse.json({ success: true });
}