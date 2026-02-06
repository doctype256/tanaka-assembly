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
 * 削除処理 (DELETE)
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'IDが必要です' }, { status: 400 });

    await ConsultationRepository.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
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