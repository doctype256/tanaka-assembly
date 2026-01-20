// /src/components/DeleteButton.tsx

'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { deleteRecord } from '@/app/admin/records/actions'; // Server Action をインポート

interface DeleteButtonProps {
    recordId: number;
    title: string;
}

// 削除実行ボタン
function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <button 
            type="submit" 
            className="text-red-600 hover:text-red-900"
            disabled={pending} // 送信中はボタンを無効化
        >
            {pending ? '削除中...' : '削除'}
        </button>
    );
}


export default function DeleteButton({ recordId, title }: DeleteButtonProps) {
    
    // Server Action の呼び出しに Client Component のロジックを追加
    const actionWithConfirm = async (formData: FormData) => {
        // 削除確認のプロンプト
        if (!window.confirm(`タイトル:「${title}」を完全に削除しますか？`)) {
            return; // キャンセルされたら処理を終了
        }
        
        // ユーザーがOKを押したら、deleteRecordアクションを実行
        const result = await deleteRecord(recordId);
        
        if (result.success) {
            // 必要であれば、成功メッセージなどを表示できます
            console.log(result.message);
        } else {
            console.error(result.message);
        }
    };
    
    // Server Action を直接使用する form の書き方に戻します
    // action={deleteRecord.bind(null, recordId)} の形式は使わず、
    // action={actionWithConfirm} に置き換えるため、formDataを渡すために
    // actionWithConfirmの引数をformDataに合わせる必要はありません。
    
    return (
        <form action={actionWithConfirm} className="inline">
            <SubmitButton />
        </form>
    );
}