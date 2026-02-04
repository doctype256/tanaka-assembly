import { NextResponse } from 'next/server';

// ダミーPDFリスト
const dummyPdfList = [
  { id: "1", title: "テストPDF", url: "/dummy/test1.pdf" },
  { id: "2", title: "ダミー資料", url: "/dummy/test2.pdf" }
];

// GETリクエスト：PDFリストを返す
export async function GET() {
  try {
    // 通常、ここでデータベースや外部APIからPDFリストを取得します。
    // ここではダミーのリストを返しています。
    return NextResponse.json(dummyPdfList);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json({ error: "PDFデータの取得に失敗しました" }, { status: 500 });
  }
}

// POSTリクエスト：新しいPDFアイテムを追加
export async function POST(request) {
  try {
    const body = await request.json();
    const newItem = {
      id: String(Date.now()),  // 新しいIDを生成
      ...body  // 送信されたPDF情報
    };

    // 通常、ここで新しいPDFをデータベースに保存します。
    // 現在はダミーデータとして保存せず、新しいアイテムを即座に返却します。
    dummyPdfList.push(newItem);  // ダミーリストに追加

    return NextResponse.json(newItem, { status: 201 });  // 作成成功のレスポンス
  } catch (error) {
    console.error("Error adding PDF:", error);
    return NextResponse.json({ error: "PDFの追加に失敗しました" }, { status: 500 });
  }
}

// DELETEリクエスト：指定されたPDFを削除
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const index = dummyPdfList.findIndex(pdf => pdf.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "PDFが見つかりません" }, { status: 404 });
    }

    // 通常、ここでデータベースからPDFを削除します。
    dummyPdfList.splice(index, 1);  // ダミーリストから削除

    return NextResponse.json({ success: true, message: "PDFが削除されました" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json({ error: "PDFの削除に失敗しました" }, { status: 500 });
  }
}
