// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuthの設定オブジェクト
const authOptions = {
  providers: [
    CredentialsProvider({
      // ログインフォームに表示される名前
      name: "Credentials",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      // 認証ロジック
      async authorize(credentials, req) {
        // ★★★ 注: ここはテスト用の仮の認証ロジックです ★★★
        
        // 実際には、Turso DBや外部認証サービスと連携して、
        // ユーザー名とパスワードを検証する必要があります。
        
        if (credentials?.username === "admin" && credentials?.password === "password123") {
          // 認証成功時
          return { id: "1", name: "管理者", email: "admin@example.com" };
        } else {
          // 認証失敗時
          return null; 
        }
      },
    }),
  ],
  // ログインページをカスタムするために設定
  pages: {
    signIn: '/login', // ログインページを /app/login/page.tsx に設定
  },
  // セキュリティキー
  secret: process.env.AUTH_SECRET,
};

// NextAuthハンドラーのエクスポート
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };