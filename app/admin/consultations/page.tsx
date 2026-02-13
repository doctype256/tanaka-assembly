// directory: app/admin/consultations/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';

// 相談データの型定義
type Consultation = {
  id: number;
  target_type: string;
  place_type: string;
  content_type: string;
  suggestion_topic: string; 
  needs_reply: number;
  email: string;
  message: string;
  status: 'unread' | 'processing' | 'completed';
  admin_memo: string | null;
  created_at: string;
};

/**
 * AdminConsultationPage: 管理者用相談管理画面
 * 機能: メール設定、一覧表示(管理情報/属性/詳細/メモ)、詳細モーダル(属性左/本文右/メモ編集)
 */
export default function AdminConsultationPage() {
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // メール通知・送信設定用のステート
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // --- データ取得ロジック ---
  const fetchConsultations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/consultations');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) { console.error("Fetch error:", error); }
    finally { setLoading(false); }
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
    } catch (error) { console.error("Fetch settings error:", error); }
  }, []);

  useEffect(() => {
    fetchConsultations();
    fetchAdminSettings();
  }, [fetchConsultations, fetchAdminSettings]);

  // --- 保存・更新ロジック ---
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const settings = [
      { key: 'admin_notification_email', value: adminEmail },
      { key: 'smtp_user', value: smtpUser },
      { key: 'smtp_pass', value: smtpPass },
    ];
    try {
      for (const s of settings) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s),
        });
      }
      alert("設定を保存しました。");
    } catch (error) { alert("保存に失敗しました。"); }
    finally { setIsSavingSettings(false); }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await fetch('/api/admin/consultations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus as any } : item));
      if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  const handleSaveMemo = async (id: number, memo: string) => {
    await fetch('/api/admin/consultations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_memo: memo }),
    });
    setData(prev => prev.map(item => item.id === id ? { ...item, admin_memo: memo } : item));
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, admin_memo: memo } : null);
  };

  const deleteConsultations = async (ids: number[]) => {
    if (!confirm(`${ids.length}件削除しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/consultations?id=${ids.join(',')}`, { method: 'DELETE' });
      if (res.ok) {
        setData(prev => prev.filter(item => !ids.includes(item.id)));
        setSelectedIds([]);
        if (selectedItem && ids.includes(selectedItem.id)) setSelectedItem(null);
      }
    } catch (error) { alert("削除に失敗しました。"); }
  };

  const filteredData = data.filter(item => {
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'needs_reply' ? item.needs_reply === 1 : item.status === filterStatus);
    return matchesStatus && (
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.admin_memo || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    if (status === 'unread') return '#fed7d7';
    if (status === 'processing') return '#fef3c7';
    return '#c6f6d5';
  };

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#2d3748' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2d3748', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>管理者ダッシュボード</h1>
        {selectedIds.length > 0 && (
          <button onClick={() => deleteConsultations(selectedIds)} style={bulkDeleteButtonStyle}>
            選択 {selectedIds.length} 件を削除
          </button>
        )}
      </div>

      {/* メール通知・送信設定パネル */}
      <div style={settingsPanelStyle}>
        <div 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h2 style={{ fontSize: '14px', margin: 0 }}>📧 メール通知・送信設定</h2>
          <span style={{ fontSize: '16px', color: '#a0aec0' }}>{isSettingsOpen ? '▲' : '▼'}</span>
        </div>

        {isSettingsOpen && (
          <div style={{ marginTop: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="メッセージ内容またはメモで検索..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ ...inputStyle, width: '100%' }} 
        />
      </div>

      {/* 相談一覧テーブル */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#2d3748', color: 'white' }}>
            <th style={{ ...thStyle, width: '40px' }}><input type="checkbox" onChange={() => setSelectedIds(selectedIds.length === filteredData.length ? [] : filteredData.map(i => i.id))} checked={selectedIds.length === filteredData.length && filteredData.length > 0} /></th>
            <th style={{ ...thStyle, width: '110px' }}>管理情報</th>
            <th style={{ ...thStyle, width: '220px' }}>相談内容の確認</th>
            <th style={thStyle}>内容の詳細</th>
            <th style={{ ...thStyle, width: '300px' }}>管理者メモ</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #edf2f7', backgroundColor: selectedIds.includes(item.id) ? '#ebf8ff' : '#fff' }}>
              <td style={tdStyle}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} /></td>
              
              <td style={{ ...tdStyle, backgroundColor: '#f9fafb' }}>
                <div style={tripleStackStyle}>
                  <div style={{ fontSize: '11px', textAlign: 'center' }}><strong>{new Date(item.created_at).toLocaleDateString()}</strong></div>
                  <select 
                    value={item.status} 
                    onChange={(e) => handleStatusChange(item.id, e.target.value)} 
                    style={{ ...selectStyle, backgroundColor: getStatusColor(item.status), width: '100%' }}
                  >
                    <option value="unread">未読</option>
                    <option value="processing">対応中</option>
                    <option value="completed">完了</option>
                  </select>
                  <button onClick={() => deleteConsultations([item.id])} style={deleteButtonStyle}>削除</button>
                </div>
              </td>

              <td style={tdStyle}>
                <div style={structContainerStyle}>
                  <div style={dataValueStyle}>{item.target_type}</div>
                  <div style={dataValueStyle}>{item.content_type}</div>
                  <div style={dataValueStyle}>{item.place_type}</div>
                  <div style={{ ...dataValueStyle, fontWeight: 'bold', color: item.needs_reply ? '#e53e3e' : '#718096' }}>
                    返信希望: {item.needs_reply ? 'あり' : '不要'}
                  </div>
                </div>
              </td>

              <td style={{ ...tdStyle, cursor: 'pointer' }} onClick={() => setSelectedItem(item)}>
                <div style={themeTextStyle}>{item.suggestion_topic}</div>
                <div style={messagePreviewStyle}>{item.message}</div>
                {item.needs_reply === 1 && <div style={urgentBadgeStyle}>連絡先: {item.email}</div>}
              </td>

              <td style={tdStyle}>
                <textarea 
                  defaultValue={item.admin_memo || ''} 
                  onBlur={(e) => handleSaveMemo(item.id, e.target.value)} 
                  placeholder="メモを入力..." 
                  style={memoAreaStyle} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div style={modalOverlayStyle} onClick={() => setSelectedItem(null)}>
          <div style={{ ...modalContentStyle, maxWidth: '1100px', width: '95%' }} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>相談内容の詳細</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <select 
                  value={selectedItem.status} 
                  onChange={(e) => handleStatusChange(selectedItem.id, e.target.value)}
                  style={{ ...selectStyle, backgroundColor: getStatusColor(selectedItem.status), padding: '8px 15px', fontSize: '14px' }}
                >
                  <option value="unread">未読</option>
                  <option value="processing">対応中</option>
                  <option value="completed">完了</option>
                </select>
                <button onClick={() => setSelectedItem(null)} style={closeButtonStyle}>&times;</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '30px', marginTop: '25px' }}>
              {/* 左側：属性データ */}
              <div style={{ flex: 1, backgroundColor: '#f7fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <h3 style={modalSubTitle}>属性データ</h3>
                <div style={modalInfoItem}><strong>テーマ:</strong><br/>{selectedItem.suggestion_topic}</div>
                <div style={modalInfoItem}><strong>時期:</strong><br/>{selectedItem.target_type}</div>
                <div style={modalInfoItem}><strong>目的:</strong><br/>{selectedItem.content_type}</div>
                <div style={modalInfoItem}><strong>場所:</strong><br/>{selectedItem.place_type}</div>
                <div style={modalInfoItem}><strong>連絡先:</strong><br/>{selectedItem.needs_reply ? selectedItem.email : '返信不要'}</div>
                <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '20px' }}>受信日時: {new Date(selectedItem.created_at).toLocaleString()}</div>
              </div>

              {/* 右側：相談内容 ＆ メモ編集 */}
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div>
                  <h3 style={modalSubTitle}>具体的な相談内容</h3>
                  <div style={{ ...messageBoxStyle, minHeight: '180px' }}>{selectedItem.message}</div>
                </div>

                <div style={{ borderTop: '2px solid #edf2f7', paddingTop: '15px' }}>
                  <h3 style={modalSubTitle}>管理者メモ</h3>
                  <textarea 
                    value={selectedItem.admin_memo || ''} 
                    onChange={(e) => handleSaveMemo(selectedItem.id, e.target.value)}
                    placeholder="対応履歴を入力..."
                    style={{ ...memoAreaStyle, height: '140px', fontSize: '14px', backgroundColor: '#fffaf0', border: '1px solid #fbd38d' }}
                  />
                  <p style={{ fontSize: '11px', color: '#718096', marginTop: '4px' }}>※自動保存されます</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- スタイル定義 ---
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'separate', borderSpacing: '0', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const thStyle: React.CSSProperties = { padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold' };
const tdStyle: React.CSSProperties = { padding: '15px 12px', verticalAlign: 'top', borderBottom: '1px solid #edf2f7' };

const tripleStackStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch' };
const structContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px' };
const dataValueStyle: React.CSSProperties = { fontSize: '13px', color: '#2d3748' };

const themeTextStyle: React.CSSProperties = { color: '#2b6cb0', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' };
const messagePreviewStyle: React.CSSProperties = { color: '#4a5568', fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' };
const urgentBadgeStyle: React.CSSProperties = { color: '#e53e3e', fontSize: '11px', fontWeight: 'bold', marginTop: '5px' };

const memoAreaStyle: React.CSSProperties = { width: '100%', height: '100px', fontSize: '13px', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fffaf0', resize: 'none', boxSizing: 'border-box' };

const settingsPanelStyle: React.CSSProperties = { backgroundColor: '#f7fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', boxSizing: 'border-box', fontSize: '13px' };
const saveButtonStyle: React.CSSProperties = { marginTop: '15px', padding: '10px 20px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' };

const selectStyle: React.CSSProperties = { padding: '5px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', border: '1px solid #e2e8f0', fontWeight: 'bold' };
const deleteButtonStyle: React.CSSProperties = { color: '#e53e3e', border: '1px solid #feb2b2', background: 'white', padding: '4px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' };
const bulkDeleteButtonStyle: React.CSSProperties = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '35px', borderRadius: '25px', maxHeight: '90vh', overflowY: 'auto' };
const modalHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '15px' };
const modalSubTitle: React.CSSProperties = { fontSize: '15px', borderLeft: '4px solid #2d3748', paddingLeft: '10px', marginBottom: '12px', fontWeight: 'bold' };
const modalInfoItem: React.CSSProperties = { fontSize: '14px', marginBottom: '12px', color: '#4a5568', lineHeight: '1.5' };
const messageBoxStyle: React.CSSProperties = { background: '#f8fafc', padding: '20px', borderRadius: '12px', whiteSpace: 'pre-wrap', border: '1px solid #edf2f7', lineHeight: '1.7', fontSize: '16px' };
const closeButtonStyle: React.CSSProperties = { border: 'none', background: 'none', fontSize: '30px', cursor: 'pointer', color: '#a0aec0' };