import { NextResponse } from 'next/server';

const dummyPdfList = [
  { id: "1", title: "テストPDF", url: "/dummy/test1.pdf" },
  { id: "2", title: "ダミー資料", url: "/dummy/test2.pdf" }
];

// GETリクエスト
export async function GET() {
  return NextResponse.json(dummyPdfList);
}

// POSTリクエスト
export async function POST(request: Request) {
  const body = await request.json();
  const newItem = {
    id: String(Date.now()),
    ...body
  };
  return NextResponse.json(newItem);
}

// DELETEリクエスト
export async function DELETE() {
  return NextResponse.json({ success: true });
}