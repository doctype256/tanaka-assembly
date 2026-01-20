//app/admin/records/edit/[id]/useEditRecord.ts
//フォームの状態や、保存時のインタラクションを担当

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useEditRecord(record: any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォームの初期状態（EditFormStatusに渡す用）
  const initialState = {
    ...record,
    success: false,
    message: '',
  };

  const handleRefresh = async () => {
    router.refresh();
  };

  return {
    initialState,
    isSubmitting,
    setIsSubmitting,
    handleRefresh
  };
}