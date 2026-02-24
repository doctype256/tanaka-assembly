// directory: app/admin/consultations/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';

// 相談データの型定義に suggestion_topic を追加
type Consultation = {
  id: number;
  target_type: string;
  place_type: string;
  content_type: string;
  suggestion_topic: string; // ← 追加: 提案されたテーマ
  needs_reply: number;
  email: string;
  message: string;
  status: 'unread' | 'processing' | 'completed';
  admin_memo: string | null;
  created_at: string;
};

/**
 * AdminConsultationPage: 相談内容一覧と管理設定
 */
export default function AdminConsultationPage() {
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // メール通知・送信設定用のステート
  const [adminEmail, setAdminEmail] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 一括選択用
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchConsultations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/consultations');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminSettings = useCallback(async () => {
    const keys = ['admin_notification_email', 'smtp_user', 'smtp_pass'];
    try {
      for (const key of keys) {
        const res = await fetch(`/api/admin/settings?key=${key}`);
        if (res.ok) {
          const json = await res.json();
          if (key === 'admin_notification_email') setAdminEmail(json.value || '');
          if (key === 'smtp_user') setSmtpUser(json.value || '');
          if (key === 'smtp_pass') setSmtpPass(json.value || '');
        }
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
    fetchAdminSettings();
  }, [fetchConsultations, fetchAdminSettings]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const settings = [
      { key: 'admin_notification_email', value: adminEmail },
      { key: 'smtp_user', value: smtpUser },
      { key: 'smtp_pass', value: smtpPass },
    ];
    try {
      for (const s of settings) {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s),
        });
        if (!res.ok) throw new Error(`${s.key} の保存に失敗しました`);
      }
      alert("送信設定を保存しました。");
    } catch (error) {
      alert("エラーが発生しました。");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const deleteConsultations = async (ids: number[]) => {
    const message = ids.length === 1 ? "削除しますか？" : `${ids.length}件削除しますか？`;
    if (!confirm(message)) return;
    try {
      const res = await fetch(`/api/admin/consultations?id=${ids.join(',')}`, { method: 'DELETE' });
      if (res.ok) {
        setData(prev => prev.filter(item => !ids.includes(item.id)));
        setSelectedIds([]);
        if (selectedItem && ids.includes(selectedItem.id)) setSelectedItem(null);
      }
    } catch (error) { alert("削除に失敗しました。"); }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await fetch('/api/admin/consultations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus as any } : item));
    }
  };

  const handleSaveMemo = async (id: number, memo: string) => {
    await fetch('/api/admin/consultations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_memo: memo }),
    });
    setData(prev => prev.map(item => item.id === id ? { ...item, admin_memo: memo } : item));
  };

  const filteredData = data.filter(item => {
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'needs_reply' ? item.needs_reply === 1 : item.status === filterStatus);
    const textContent = `${item.message} ${item.admin_memo || ''} ${item.suggestion_topic} ${item.email}`;
    return matchesStatus && textContent.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    if (status === 'unread') return '#fed7d7';
    if (status === 'processing') return '#fef3c7';
    return '#c6f6d5';
  };

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2d3748', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>管理者ダッシュボード</h1>
        {selectedIds.length > 0 && (
          <button onClick={() => deleteConsultations(selectedIds)} style={bulkDeleteButtonStyle}>
            選択した {selectedIds.length} 件を削除
          </button>
        )}
      </div>

      {/* メール設定パネル */}
      <div style={settingsPanelStyle}>
        <h2 style={sectionTitleStyle}>📧 メール通知・送信設定</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>通知先メールアドレス</label>
            <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>送信用Gmailアドレス</label>
            <input type="email" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Gmailアプリパスワード（16桁）</label>
            <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <button onClick={handleSaveSettings} disabled={isSavingSettings} style={saveButtonStyle}>
          {isSavingSettings ? '保存中...' : '設定を保存'}
        </button>
      </div>

      {/* 検索・フィルタ */}
      <div style={{ display: 'flex', gap: '15px', margin: '30px 0 20px' }}>
        <input type="text" placeholder="内容・テーマ・メモを検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={inputStyle} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">すべての状態</option>
          <option value="unread">未読</option>
          <option value="processing">対応中</option>
          <option value="needs_reply">返信必要</option>
        </select>
      </div>

      {/* 相談一覧テーブル */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#2d3748', color: 'white' }}>
            <th style={thStyle}><input type="checkbox" onChange={() => setSelectedIds(selectedIds.length === filteredData.length ? [] : filteredData.map(i => i.id))} checked={selectedIds.length === filteredData.length && filteredData.length > 0} /></th>
            <th style={thStyle}>日時 / 分類</th>
            <th style={thStyle}>選択されたテーマ ＆ 内容</th>
            <th style={thStyle}>管理者メモ</th>
            <th style={thStyle}>状態</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: selectedIds.includes(item.id) ? '#ebf8ff' : '#fff' }}>
              <td style={tdStyle}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} /></td>
              <td style={tdStyle}>
                <small>{new Date(item.created_at).toLocaleString()}</small><br />
                <span style={categoryBadgeStyle}>{item.target_type}</span>
              </td>
              <td style={{ ...tdStyle, cursor: 'pointer' }} onClick={() => setSelectedItem(item)}>
                <div style={themeTextStyle}>【{item.suggestion_topic}】</div>
                <div style={messageSnippetStyle}>{item.message}</div>
                {item.needs_reply === 1 && <span style={urgentBadgeStyle}>返信必要</span>}
              </td>
              <td style={tdStyle}>
                <textarea defaultValue={item.admin_memo || ''} onBlur={(e) => handleSaveMemo(item.id, e.target.value)} placeholder="メモを入力..." style={memoAreaStyle} />
              </td>
              <td style={tdStyle}>
                <select value={item.status} onChange={(e) => handleStatusChange(item.id, e.target.value)} style={{ ...selectStyle, backgroundColor: getStatusColor(item.status), width: '100%' }}>
                  <option value="unread">未読</option>
                  <option value="processing">対応中</option>
                  <option value="completed">完了</option>
                </select>
              </td>
              <td style={tdStyle}>
                <button onClick={() => deleteConsultations([item.id])} style={deleteButtonStyle}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div style={modalOverlayStyle} onClick={() => setSelectedItem(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>相談詳細</h3>
              <button onClick={() => setSelectedItem(null)} style={closeButtonStyle}>&times;</button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={modalSectionStyle}><strong>送信日時:</strong> {new Date(selectedItem.created_at).toLocaleString()}</div>
              <div style={modalSectionStyle}><strong>分類パス:</strong> {selectedItem.target_type} ＞ {selectedItem.place_type} ＞ {selectedItem.content_type}</div>
              <div style={modalSectionStyle}><strong>選択されたテーマ:</strong> <span style={{ color: '#2d3748', fontWeight: 'bold' }}>{selectedItem.suggestion_topic}</span></div>
              <div style={modalSectionStyle}><strong>メールアドレス:</strong> {selectedItem.needs_reply ? <a href={`mailto:${selectedItem.email}`} style={{ color: '#3182ce' }}>{selectedItem.email}</a> : '不要'}</div>
              <div style={modalSectionStyle}><strong>相談内容詳細:</strong><div style={messageBoxStyle}>{selectedItem.message}</div></div>
              <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <button onClick={() => deleteConsultations([selectedItem.id])} style={deleteButtonStyle}>この相談を削除</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// スタイル定義（Admin専用）
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const thStyle: React.CSSProperties = { padding: '12px', textAlign: 'left', fontSize: '13px' };
const tdStyle: React.CSSProperties = { padding: '12px', verticalAlign: 'top', fontSize: '13px' };
const inputStyle: React.CSSProperties = { padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const selectStyle: React.CSSProperties = { padding: '8px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' };
const settingsPanelStyle: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: '#4a5568' };
const sectionTitleStyle: React.CSSProperties = { fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' };
const saveButtonStyle: React.CSSProperties = { marginTop: '20px', padding: '12px 24px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const themeTextStyle: React.CSSProperties = { color: '#2d3748', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' };
const messageSnippetStyle: React.CSSProperties = { color: '#4a5568', textDecoration: 'underline' };
const categoryBadgeStyle: React.CSSProperties = { fontSize: '11px', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' };
const urgentBadgeStyle: React.CSSProperties = { backgroundColor: '#e53e3e', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginTop: '5px', display: 'inline-block' };
const memoAreaStyle: React.CSSProperties = { width: '100%', height: '60px', fontSize: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' };
const deleteButtonStyle: React.CSSProperties = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' };
const bulkDeleteButtonStyle: React.CSSProperties = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '16px', maxWidth: '750px', width: '90%', maxHeight: '85vh', overflowY: 'auto' };
const modalHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' };
const modalSectionStyle: React.CSSProperties = { marginBottom: '12px', fontSize: '14px', borderBottom: '1px solid #f7fafc', paddingBottom: '8px' };
const messageBoxStyle: React.CSSProperties = { background: '#f8fafc', padding: '15px', borderRadius: '8px', whiteSpace: 'pre-wrap', marginTop: '10px', border: '1px solid #edf2f7', lineHeight: '1.7' };
const closeButtonStyle: React.CSSProperties = { border: 'none', background: 'none', fontSize: '28px', cursor: 'pointer', color: '#a0aec0' };