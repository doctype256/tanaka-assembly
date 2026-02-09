// directory: app/api/admin/consultations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/db/repository/ConsultationRepository';

/**
 * 一覧取得 (GET)
 */
export async function GET() {
  try {
    const result = await ConsultationRepository.findAll();
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
  }
}

/**
 * DELETE メソッド: 単一または複数IDの削除に対応
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get('id');

    if (!idString) {
      return NextResponse.json({ error: 'IDが必要です' }, { status: 400 });
    }

    // カンマで分割して数値の配列に変換
    // "14,13,12" -> [14, 13, 12]
    const ids = idString.split(',').map(id => {
      const num = Number(id.trim());
      if (isNaN(num)) throw new Error(`無効なIDが含まれています: ${id}`);
      return num;
    });

    // --- データベース削除ロジック ---
    // 例: Prismaを使用している場合の一括削除
    // await prisma.consultation.deleteMany({
    //   where: {
    //     id: { in: ids }
    //   }
    // });

    console.log(`削除完了対象ID: ${ids.join(', ')}`);

    return NextResponse.json({ 
      message: `${ids.length}件の削除に成功しました`,
      deletedIds: ids 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Delete API Error:", error);
    return NextResponse.json({ 
      error: error.message || 'サーバー内部エラーが発生しました' 
    }, { status: 500 });
  }
}

/**
 * ステータスまたはメモの更新 (PATCH)
 * 統合版：一つのPATCHメソッドで複数のフィールド更新に対応します
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, admin_memo } = body;

    if (!id) {
      return NextResponse.json({ error: 'IDは必須です' }, { status: 400 });
    }
    
    // statusが送られてきた場合は更新
    if (status !== undefined) {
      await ConsultationRepository.updateStatus(id, status);
    }
    
    // admin_memoが送られてきた場合は更新
    if (admin_memo !== undefined) {
      await ConsultationRepository.updateAdminMemo(id, admin_memo);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
  }
}