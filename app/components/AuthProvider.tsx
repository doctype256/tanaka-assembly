// app/components/AuthProvider.tsx

'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// NextAuth.js の機能（signIn, signOut, useSession）を子コンポーネントで利用可能にする
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}