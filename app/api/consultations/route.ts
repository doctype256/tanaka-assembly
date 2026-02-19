// directory: app/api/consultations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/db/repository/ConsultationRepository';
import { client } from "@/db/client"; 
import crypto from 'crypto';
import nodemailer from 'nodemailer';

/**
 * POST: 相談受付・保存・管理者通知
 * タイトルを簡潔にし、本文のレイアウトを視認性重視で構築しました。
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. バリデーション
    const { target_type, place_type, content_type, suggestion_topic, message } = body;
    if (!target_type || !place_type || !content_type || !suggestion_topic || !message) {
      return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 });
    }

    // 2. メタデータ取得
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    const ip_hash = crypto.createHash('sha256').update(ip).digest('hex');
    const user_agent = req.headers.get('user-agent') || 'unknown';
    const referer_url = req.headers.get('referer') || 'unknown';

    // 3. DB保存
    await ConsultationRepository.create({
      target_type,
      place_type,
      content_type,
      suggestion_topic,
      needs_reply: body.needs_reply || false,
      email: body.email || '',
      message,
      ip_hash,
      user_agent,
      referer_url,
    });

    // 4. 送信設定取得
    const settingsResult = await client.execute({
      sql: "SELECT key, value FROM site_settings WHERE key IN ('admin_notification_email', 'smtp_user', 'smtp_pass')",
      args: []
    });

    const settings: Record<string, string> = {};
    settingsResult.rows.forEach(row => {
      settings[row.key as string] = row.value as string;
    });

    const targetEmail = settings['admin_notification_email'];
    const smtpUser = settings['smtp_user'];
    const smtpPass = settings['smtp_pass'];

    // 5. メール送信
    if (targetEmail && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });

      // 【修正】件名を簡潔にし、一目でテーマがわかるように
      const mailOptions = {
        from: smtpUser,
        to: targetEmail,
        subject: `【新着相談】${suggestion_topic}`,
        text: `
新しい相談が届きました。
詳細は以下の通りです。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 相談テーマ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
テーマ：${suggestion_topic}

【分類情報】
・対象：${target_type}
・場所：${place_type}
・内容：${content_type}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 連絡先
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
・返信希望　：${body.needs_reply ? 'あり' : 'なし'}
・メール　　：${body.email || '未入力'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 相談内容詳細
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
※このメールはシステムからの自動通知です。
管理画面より対応状況の更新を行ってください。
`.trim(),
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: '送信が完了しました。' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}