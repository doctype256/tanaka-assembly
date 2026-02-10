// directory: app/layout.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import ConsultationFloatButton from '@/components/ConsultationFloatButton';

/**
 * RootLayout: アプリケーションのルートレイアウト
 * 特定のページでは相談ボタンを非表示にする制御を行います。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ボタンを表示させないパスのリスト
  const hideButtonPaths = [
    '/consultation', // 相談フォーム自身
    '/admin',        // 管理者ページ（前方一致で判定する場合は別途ロジックが必要）
  ];

  // 管理者ページ配下（/admin/xxx など）も一括で非表示にする判定
  const isHiddenPath = hideButtonPaths.some(path => pathname.startsWith(path));

  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>
        {/* メインコンテンツ */}
        {children}

        {/* 特定のパス以外の場合のみ相談ボタンを表示 */}
        {!isHiddenPath && <ConsultationFloatButton />}
      </body>
    </html>
  );
}