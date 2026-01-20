// /components/EditFormStatus.tsx

'use client'; 

import React, { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; 

import { redirect } from 'next/navigation';

import { updateRecord } from '../../app/admin/records/actions'; 


// -----------------------------------------------------
// 型定義
// -----------------------------------------------------
interface RecordData {
    id: number;
    title: string;
    content: string;
    record_date: string;
    category: string | null;
    is_published: number; // 1:公開, 0:非公開
}

// 💡 修正 1: アクションの状態（成功/メッセージ）のみの型
interface ActionState {
    success: boolean;
    message: string;
}

// 💡 修正 2: 親コンポーネントから受け取る初期状態（データ + 状態）
interface InitialState extends RecordData, ActionState {}

interface EditFormStatusProps {
    initialState: InitialState;
    recordId: number;
}


// -----------------------------------------------------
// 1. 送信ボタンの状態を管理する Client Component (変更なし)
// -----------------------------------------------------
function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <button
          type="submit"
          disabled={pending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150"
        >
          {pending ? '更新中...' : '記録を更新する'}
        </button>
    );
}

// -----------------------------------------------------
// 2. フォームの状態とメッセージを表示する Client Component (メイン)
// -----------------------------------------------------
export default function EditFormStatus({ initialState, recordId }: EditFormStatusProps) {
    
    // ラッパー関数 actionWrapper
    const actionWrapper = async (
        // 💡 修正 3: prevStateの型を ActionState に変更
        prevState: ActionState, 
        formData: FormData
    ): Promise<ActionState> => {
        // updateRecord の戻り値は { success, message } なので、ActionState と一致
        return await updateRecord(prevState, recordId, formData);
    };

    // 💡 修正 4: useActionState に渡す初期状態を ActionState のみで作成
    const actionInitialState: ActionState = {
        success: initialState.success,
        message: initialState.message,
    };
    
    // useActionState でフォームの状態を管理し、アクションを実行
    const [state, formAction] = useActionState(actionWrapper, actionInitialState);
    
    // 成功時にリダイレクト処理 (stateはActionState型)
    if (state && state.success && state.message !== '初期状態') { 
        redirect('/admin/records?status=updated');
    }
    
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
            
            {/* フォーム本体: actionをformActionに設定 */}
            <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                
                {/* タイトル */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">タイトル (必須)</label>
                  <input
                    type="text" id="title" name="title" required
                    defaultValue={initialState.title} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 活動日 */}
                <div>
                  <label htmlFor="record_date" className="block text-sm font-medium text-gray-700 mb-1">活動日 (必須)</label>
                  <input
                    type="date" id="record_date" name="record_date" required
                    defaultValue={initialState.record_date} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* カテゴリ (任意) */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">カテゴリ (任意)</label>
                  <input
                    type="text" id="category" name="category"
                    defaultValue={initialState.category || ''} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 内容 */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">内容 (必須)</label>
                  <textarea
                    id="content" name="content" rows={8} required
                    defaultValue={initialState.content} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* 公開設定 */}
                <div className="flex items-center">
                  <input
                    id="is_published" name="is_published" type="checkbox" value="1"
                    defaultChecked={initialState.is_published === 1} 
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm font-medium text-gray-700">公開する</label>
                </div>
                
                {/* 隠しフィールド */}
                <input type="hidden" name="is_published" value="0" /> 

                {/* 更新ボタン (Client Component) */}
                <SubmitButton />
              </form>
        </div>
    );
}