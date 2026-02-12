// directory: app/api/consultations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/db/repository/ConsultationRepository';
import { client } from "@/db/client"; 
import crypto from 'crypto';
import nodemailer from 'nodemailer';

/**
 * ユーザーからの相談を受け付け、DB保存および管理者へのメール通知を行う
 * 送信設定（Gmail認証情報）はデータベースから動的に取得します。
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. 必須項目のバリデーション
    const { target_type, place_type, content_type, message } = body;
    if (!target_type || !place_type || !content_type || !message) {
      return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 });
    }

    // 2. セキュリティ・メタデータの取得
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    const ip_hash = crypto.createHash('sha256').update(ip).digest('hex');
    const user_agent = req.headers.get('user-agent') || 'unknown';
    const referer_url = req.headers.get('referer') || 'unknown';

    // 3. DBへの保存実行（オブジェクト指向に基づきRepositoryを使用）
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

    // 4. DBからメール送信設定を一括取得
    // 必要な3つのキー（通知先、送信元、パスワード）を一度に取得します
    const settingsResult = await client.execute({
      sql: "SELECT key, value FROM site_settings WHERE key IN ('admin_notification_email', 'smtp_user', 'smtp_pass')",
      args: []
    });

    // 取得したレコードを使いやすいようにマップ化
    const settings: Record<string, string> = {};
    settingsResult.rows.forEach(row => {
      settings[row.key as string] = row.value as string;
    });

    const targetEmail = settings['admin_notification_email'];
    const smtpUser = settings['smtp_user'];
    const smtpPass = settings['smtp_pass'];

    // 5. 管理者へのメール送信処理
    // 全ての設定値がDBに保存されている場合のみ実行
    if (targetEmail && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass, // 管理画面で入力された16桁のアプリパスワード
        },
      });

      const mailOptions = {
        from: smtpUser,
        to: targetEmail,
        subject: `【相談通知】新しい相談が届きました (${target_type})`,
        text: `
相談内容が届きました。

■ 相談の分類
・ターゲット: ${target_type}
・場所: ${place_type}
・内容の種類: ${content_type}

■ 連絡先情報
・返信希望: ${body.needs_reply ? 'あり' : 'なし'}
・メールアドレス: ${body.email || '未入力'}

■ 相談内容
${message}

---
このメールはシステムより自動送信されています。
管理者画面から詳細を確認し、対応を行ってください。
        `.trim(),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Notification sent successfully to ${targetEmail}`);
    } else {
      console.warn("Mail sending skipped: Missing DB settings (email, user, or pass)");
    }

    return NextResponse.json({ success: true, message: '送信が完了しました。' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました。' }, { status: 500 });
  }
}