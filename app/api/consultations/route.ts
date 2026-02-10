// directory: app/api/consultations/route.ts
// ユーザーからの相談内容をDBに保存するAPIエンドポイント

import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/db/repository/ConsultationRepository';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 必須項目のバリデーション
    const { target_type, place_type, content_type, message } = body;
    if (!target_type || !place_type || !content_type || !message) {
      return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 });
    }

    // セキュリティ・メタデータの取得
    // NextRequest に .ip が存在しない環境を考慮しヘッダーから取得
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    // IPアドレスをハッシュ化して保存（プライバシー配慮）
    const ip_hash = crypto.createHash('sha256').update(ip).digest('hex');
    const user_agent = req.headers.get('user-agent') || 'unknown';
    const referer_url = req.headers.get('referer') || 'unknown';

/* --- テストのため一時的にコメントアウト ---
    // 24時間以内の連続投稿制限チェック
    const isLimited = await ConsultationRepository.checkLimit(ip_hash);
    if (isLimited) {
      return NextResponse.json({ error: '連投制限中です。24時間後にお試しください。' }, { status: 429 });
    }
    --------------------------------------- */

    // DBへの保存実行
    await ConsultationRepository.create({
      target_type,
      place_type,
      content_type,
      needs_reply: body.needs_reply || false,
      email: body.email || '',
      message,
      ip_hash,
      user_agent,
      referer_url,
    });

    return NextResponse.json({ success: true, message: '送信が完了しました。' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}