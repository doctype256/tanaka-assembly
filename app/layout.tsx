/**
 * directory: app/layout.tsx
 * Next.js の動作に必須となるルートレイアウト
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {/* ここに page.tsx の内容が注入されます */}
        {children}
      </body>
    </html>
  )
}