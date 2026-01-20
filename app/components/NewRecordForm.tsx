// /components/NewRecordForm.tsx

'use client'; 

import React, { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; 

import { createRecord } from '../../app/admin/records/actions'; 


// -----------------------------------------------------
// 型定義 (EditFormStatusと共通の ActionState 構造)
// -----------------------------------------------------
interface ActionState {
    success: boolean;
    message: string;
}

interface NewRecordFormProps {
    initialState: ActionState;
}


// -----------------------------------------------------
// 1. 送信ボタンの状態を管理する Client Component
// -----------------------------------------------------
function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <button
          type="submit"
          disabled={pending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150"
        >
          {pending ? '作成中...' : '記録を保存する'}
        </button>
    );
}

// -----------------------------------------------------
// 2. フォームの状態とメッセージを表示する Client Component (メイン)
// -----------------------------------------------------
export default function NewRecordForm({ initialState }: NewRecordFormProps) {
    
    // useActionState でフォームの状態を管理し、アクションを実行
    const [state, formAction] = useActionState(createRecord, initialState);
    
    return (
        <div className="mt-4">
            {/* 成功/エラーメッセージの表示 */}
            {state && state.message && state.message !== '初期状態' && (
                <div 
                    className={`p-4 mb-4 rounded-lg ${state.success ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}
                    role="alert"
                >
                    {state.message}
                </div>
            )}
            
            {/* フォーム本体: actionをformActionに設定 (EditFormStatusと同じレイアウト) */}
            <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                
                {/* タイトル */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">タイトル (必須)</label>
                  <input
                    type="text" id="title" name="title" required
                    placeholder="タイトルを入力してください"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 活動日 */}
                <div>
                  <label htmlFor="record_date" className="block text-sm font-medium text-gray-700 mb-1">活動日 (必須)</label>
                  <input
                    type="date" id="record_date" name="record_date" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* カテゴリ (任意) */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">カテゴリ (任意)</label>
                  <input
                    type="text" id="category" name="category"
                    placeholder="例: 市場調査"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 内容 */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">内容 (必須)</label>
                  <textarea
                    id="content" name="content" rows={8} required
                    placeholder="具体的な内容を入力してください"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 公開設定 */}
                <div className="flex items-center">
                  <input
                    id="is_published" name="is_published" type="checkbox" value="1"
                    defaultChecked={true} 
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm font-medium text-gray-700">公開する</label>
                </div>
                
                {/* 隠しフィールド */}
                <input type="hidden" name="is_published" value="0" /> 

                {/* 保存ボタン (SubmitButton) */}
                <SubmitButton />
              </form>
        </div>
    );
}