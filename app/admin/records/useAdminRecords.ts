// app/admin/records/useAdminRecords.ts
"use client";

import { togglePublishStatus } from './actions';

/**
 * 【ロジック層】管理画面の振る舞いを定義するフック
 */
export function useAdminRecords() {
  /**
   * ステータス切り替えハンドラー
   * @param id レコードID
   * @param currentStatus 現在の公開状態
   */
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      // ユーザーの意図を反転させてサーバーアクションに伝える
      const nextStatus = !currentStatus;
      const result = await togglePublishStatus(id, nextStatus);
      
      if (!result.success) {
        alert("更新に失敗しました");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      alert("通信エラーが発生しました");
    }
  };

  return {
    handleToggleStatus,
  };
}