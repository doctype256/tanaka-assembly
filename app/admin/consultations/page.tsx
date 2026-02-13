// directory: app/admin/consultations/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';

type Consultation = {
  id: number;
  target_type: string;
  place_type: string;
  content_type: string;
  needs_reply: number;
  email: string;
  message: string;
  status: 'unread' | 'processing' | 'completed';
  admin_memo: string | null;
  created_at: string;
};

/**
 * AdminConsultationPage: メール送受信設定を統合した管理者画面
 */
export default function AdminConsultationPage() {
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- 通知・メール設定用のステート ---
  const [adminEmail, setAdminEmail] = useState(''); // 通知先
  const [smtpUser, setSmtpUser] = useState('');     // 送信元Gmail
  const [smtpPass, setSmtpPass] = useState('');     // アプリパスワード
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // --- 一括選択用のステート ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /**
   * 相談一覧の取得
   */
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

  /**
   * DBからすべての設定を取得
   */
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

  /**
   * 全設定の一括保存
   */
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
      alert("メール送信設定をすべて保存しました。");
    } catch (error) {
      alert("設定の保存中にエラーが発生しました。");
    } finally {
      setIsSavingSettings(false);
    }
  };

  /**
   * 削除処理（単一および一括共通）
   */
  const deleteConsultations = async (ids: number[]) => {
    const message = ids.length === 1 
      ? "この項目を削除しますか？" 
      : `${ids.length}件の項目をまとめて削除しますか？\nこの操作は取り消せません。`;

    if (!confirm(message)) return;

    try {
      const idParams = ids.join(',');
      const res = await fetch(`/api/admin/consultations?id=${idParams}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setData(prev => prev.filter(item => !ids.includes(item.id)));
        setSelectedIds([]);
        if (selectedItem && ids.includes(selectedItem.id)) setSelectedItem(null);
        alert("削除が完了しました。");
      }
    } catch (error) {
      alert("通信エラーが発生しました。");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(item => item.id));
    }
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
    const textContent = `${item.message} ${item.admin_memo || ''} ${item.email} ${item.target_type}`;
    const matchesSearch = textContent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return '#fed7d7';
      case 'processing': return '#fef3c7';
      case 'completed': return '#c6f6d5';
      default: return '#edf2f7';
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2d3748', paddingBottom: '10px' }}>
        <h1>管理者ダッシュボード</h1>
        {selectedIds.length > 0 && (
          <button 
            onClick={() => deleteConsultations(selectedIds)}
            style={{ ...deleteButtonStyle, padding: '10px 20px', fontSize: '14px', fontWeight: 'bold' }}
          >
            選択した {selectedIds.length} 件を削除
          </button>
        )}
      </div>

      {/* --- 送信設定セクション --- */}
      <div style={settingsPanelStyle}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          📧 メール通知・送信設定
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>通知先メールアドレス（議員本人の受信先）</label>
            <input 
              type="email" 
              placeholder="例: giin-name@example.com" 
              value={adminEmail} 
              onChange={(e) => setAdminEmail(e.target.value)} 
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div>
            <label style={labelStyle}>送信用Gmailアドレス（システムが使用する箱）</label>
            <input 
              type="email" 
              placeholder="例: system-sender@gmail.com" 
              value={smtpUser} 
              onChange={(e) => setSmtpUser(e.target.value)} 
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Gmailアプリパスワード（16桁）</label>
            <input 
              type="password" 
              placeholder="Googleアカウントで発行した16桁のコードを入力" 
              value={smtpPass} 
              onChange={(e) => setSmtpPass(e.target.value)} 
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        </div>
        <button 
          onClick={handleSaveSettings} 
          disabled={isSavingSettings}
          style={{ 
            ...nextButtonStyle, 
            backgroundColor: isSavingSettings ? '#718096' : '#2d3748',
            marginTop: '20px'
          }}
        >
          {isSavingSettings ? '保存中...' : 'すべての設定を保存'}
        </button>
        <p style={{ fontSize: '12px', color: '#718096', marginTop: '10px' }}>
          ※設定を変更した後は必ず「保存」を押してください。
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="内容・メモ・メールを検索..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={inputStyle} 
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">すべての状態</option>
          <option value="unread">未読</option>
          <option value="processing">対応中</option>
          <option value="needs_reply">返信必要</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2d3748', color: 'white', textAlign: 'left' }}>
            <th style={{ ...thStyle, width: '40px' }}>
              <input 
                type="checkbox" 
                onChange={toggleAll} 
                checked={selectedIds.length === filteredData.length && filteredData.length > 0} 
                style={checkboxStyle}
              />
            </th>
            <th style={thStyle}>日時 / 分類</th>
            <th style={thStyle}>相談内容</th>
            <th style={thStyle}>管理者メモ</th>
            <th style={thStyle}>状態</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr 
              key={item.id} 
              style={{ 
                borderBottom: '1px solid #e2e8f0', 
                backgroundColor: selectedIds.includes(item.id) ? '#ebf8ff' : (item.needs_reply && item.status !== 'completed' ? '#fffaf0' : '#fff')
              }}
            >
              <td style={tdStyle}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(item.id)} 
                  onChange={() => toggleSelect(item.id)} 
                  style={checkboxStyle}
                />
              </td>
              <td style={tdStyle}>
                <small>{new Date(item.created_at).toLocaleString()}</small><br />
                <strong>{item.target_type}</strong>
              </td>
              <td 
                style={{ ...tdStyle, color: '#3182ce', cursor: 'pointer', fontWeight: '500' }} 
                onClick={() => setSelectedItem(item)}
              >
                <div style={{ textDecoration: 'underline' }}>
                  {item.message.substring(0, 40)}{item.message.length > 40 ? '...' : ''}
                </div>
                {item.needs_reply === 1 && (
                  <span style={urgentBadgeStyle}>返信必要</span>
                )}
              </td>
              <td style={tdStyle}>
                <textarea 
                  defaultValue={item.admin_memo || ''} 
                  onBlur={(e) => handleSaveMemo(item.id, e.target.value)}
                  placeholder="対応記録を記入..."
                  style={memoAreaStyle}
                />
              </td>
              <td style={tdStyle}>
                <select 
                  value={item.status} 
                  onChange={(e) => handleStatusChange(item.id, e.target.value)} 
                  style={{ ...selectStyle, backgroundColor: getStatusColor(item.status), width: '100%' }}
                >
                  <option value="unread">未読</option>
                  <option value="processing">対応中</option>
                  <option value="completed">完了</option>
                </select>
              </td>
              <td style={tdStyle}>
                <button 
                  onClick={() => deleteConsultations([item.id])}
                  style={deleteButtonStyle}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div style={modalOverlayStyle} onClick={() => setSelectedItem(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>相談詳細</h3>
              <button onClick={() => setSelectedItem(null)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={modalSectionStyle}><strong>送信日時:</strong> {new Date(selectedItem.created_at).toLocaleString()}</div>
              <div style={modalSectionStyle}><strong>分類:</strong> {selectedItem.target_type} ＞ {selectedItem.place_type} ＞ {selectedItem.content_type}</div>
              <div style={modalSectionStyle}><strong>メールアドレス:</strong> {selectedItem.needs_reply ? <a href={`mailto:${selectedItem.email}`} style={{ color: '#3182ce' }}>{selectedItem.email}</a> : '不要'}</div>
              <div style={modalSectionStyle}><strong>相談内容:</strong><div style={messageBoxStyle}>{selectedItem.message}</div></div>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => deleteConsultations([selectedItem.id])} style={{ ...deleteButtonStyle, padding: '10px 20px' }}>この相談を削除する</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// スタイル定義
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#4a5568' };
const settingsPanelStyle: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid #e2e8f0' };
const checkboxStyle: React.CSSProperties = { width: '25px', height: '25px', cursor: 'pointer' };
const thStyle: React.CSSProperties = { padding: '12px' };
const tdStyle: React.CSSProperties = { padding: '12px', verticalAlign: 'top', fontSize: '13px' };
const inputStyle: React.CSSProperties = { padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };
const selectStyle: React.CSSProperties = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' };
const memoAreaStyle: React.CSSProperties = { width: '100%', height: '60px', fontSize: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #eee', boxSizing: 'border-box' };
const urgentBadgeStyle: React.CSSProperties = { backgroundColor: '#e53e3e', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginTop: '5px', display: 'inline-block' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' };
const modalSectionStyle: React.CSSProperties = { marginBottom: '15px', borderBottom: '1px solid #f7fafc', paddingBottom: '10px' };
const messageBoxStyle: React.CSSProperties = { background: '#f7fafc', padding: '15px', borderRadius: '8px', whiteSpace: 'pre-wrap', marginTop: '10px', border: '1px solid #edf2f7', lineHeight: '1.6' };
const deleteButtonStyle: React.CSSProperties = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const nextButtonStyle: React.CSSProperties = { width: '100%', padding: '18px', marginTop: '15px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };