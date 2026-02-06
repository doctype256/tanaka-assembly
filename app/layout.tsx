// directory: app/layout.tsx
import React from 'react';
import ConsultationFloatButton from '@/components/ConsultationFloatButton';

/**
 * RootLayout クラス（コンポーネント）
 * アプリケーションの基盤となるレイアウトを定義します。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>
        {/* メインコンテンツの注入 */}
        {children}

        {/* クライアントサイドでのみ動作する相談用フローティングボタン */}
        <ConsultationFloatButton />
      </body>
    </html>
  );
}