// directory: app/consultation/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  CONSULTATION_QUESTIONS, 
  getSuggestions, 
  SUGGESTION_MASTER 
} from './consultation-logic';

// 保存用キーの定数化
const STORAGE_KEY = 'consultation_form_draft_v4';

/**
 * ConsultationPage: ステップ形式の相談フォーム
 * 詳細記入ステップ（Step 6）にて、これまでの選択内容とテーマ提案を表示します。
 */
export default function ConsultationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPc, setIsPc] = useState(false);

  // 初期データ構造
  const initialFormData = {
    q1_id: 0,
    q2_id: 0,
    q3_id: 0,
    selected_suggestion_id: 0, 
    needs_reply: false,
    email: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // 1. マウント時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { savedStep, savedData } = JSON.parse(saved);
        setStep(savedStep || 1);
        setFormData(savedData);
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. 自動保存
  useEffect(() => {
    if (isInitialized && step < 7) {
      const draft = { savedStep: step, savedData: formData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, step, isInitialized]);

  const progressPercent = Math.round((step / 7) * 100);

  const handleReset = () => {
    if (confirm("入力内容をすべて消去して、最初からやり直しますか？")) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initialFormData);
      setStep(1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (formData.selected_suggestion_id === 0) {
      alert("相談内容に近いテーマを選択してください。");
      return;
    }

    setLoading(true);
    setStatus('送信中...');

    const payload = {
      target_type: CONSULTATION_QUESTIONS.q1.options.find(o => o.id === formData.q1_id)?.text,
      place_type: CONSULTATION_QUESTIONS.q2.options.find(o => o.id === formData.q2_id)?.text,
      content_type: CONSULTATION_QUESTIONS.q3.options.find(o => o.id === formData.q3_id)?.text,
      suggestion_topic: formData.selected_suggestion_id === -1 
        ? "該当なし（自由記述）" 
        : SUGGESTION_MASTER[formData.selected_suggestion_id],
      needs_reply: formData.needs_reply,
      email: formData.email,
      message: formData.message
    };

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus(`✅ 送信完了: ありがとうございました。`);
        localStorage.removeItem(STORAGE_KEY);
        setStep(7);
        window.parent.postMessage('CONSULTATION_SUBMITTED', '*');
      } else {
        const result = await response.json();
        setStatus(`❌ エラー: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ 通信エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };


  const questionbuttonStyle: React.CSSProperties = {
  width: "100%",
  border: "3px solid #ffffff",
  borderRadius: "20px",
  backgroundColor: "#d4e6f7",
  cursor: "pointer",
  boxSizing: "border-box",

  ...(isPc
    ? {
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        padding: "10px",
      }
    : {
        padding: "15px",
        fontSize: "15px",
      }),
};

const necessarybuttonStyle: React.CSSProperties = {
  width: "100%",
  border: "3px solid #ffffff",
  borderRadius: "20px",
  backgroundColor: "#d4e6f7",
  cursor: "pointer",
  boxSizing: "border-box",
  

  ...(isPc
    ? {
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        padding: "10px",
      }
    : {
        padding: "15px",
        fontSize: "15.5px",
      }),
};


const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  boxSizing: "border-box",
};

  const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: isPc ? "repeat(2,220px)" : "1fr",
  justifyContent: "center",
  gap: "20px",
};

const necessarygridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: isPc ? "repeat(2,180px)" : "1fr",
  justifyContent: "center",
  gap: "20px",
};

  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth >= 600); // ← ここを1024→768に
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, 
  []);

  if (!isInitialized) return null;

  return (
  <div
    style={{
      position: 'relative',
      padding: '20px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'M PLUS Rounded 1c, sans-serif',
      boxSizing: 'border-box',
      minHeight: '100vh',
      overflow: 'hidden'
    }}
  >
    {/* 背景イラストレイヤー */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url("/assets/ご相談ポスト背景1.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        opacity: 0.4,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />

    {/* フォーム本体 */}
    <div style={{ position: 'relative', zIndex: 1 }}>

      {step <= 7 && (
        <div style={{ marginBottom: '30px', fontSize: '14.2px', fontWeight: 'bold', color: '#666' }}>
          進捗: {progressPercent}%
          <div style={{ width: '100%', height: '6px', background: '#FCFDFE', marginTop: '8px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#4a86c5', transition: '0.3s ease-in-out' }}></div>
          </div>
        </div>
      )}

      <div style={{ minHeight: '400px' }}>
        {step === 1 && (
          <div>
            <h2 style={titleStyle}>{CONSULTATION_QUESTIONS.q1.title}</h2>
            <div style={gridStyle}>
              {CONSULTATION_QUESTIONS.q1.options.map((opt) => (
                <button key={opt.id} onClick={() => { setFormData({ ...formData, q1_id: opt.id }); nextStep(); }} style={questionbuttonStyle}>{opt.text}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={titleStyle}>{CONSULTATION_QUESTIONS.q2.title}</h2>
            <div style={gridStyle}>
              {CONSULTATION_QUESTIONS.q2.options.map(opt => (
                <button key={opt.id} onClick={() => { setFormData({...formData, q2_id: opt.id}); nextStep(); }} style={questionbuttonStyle}>{opt.text}</button>
              ))}
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={titleStyle}>{CONSULTATION_QUESTIONS.q3.title}</h2>
            <div style={gridStyle}>
              {CONSULTATION_QUESTIONS.q3.options.map(opt => (
                <button key={opt.id} onClick={() => { setFormData({...formData, q3_id: opt.id}); nextStep(); }} style={questionbuttonStyle}>{opt.text}</button>
              ))}
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={titleStyle}>返信を希望されますか？</h2>
            <div style={necessarygridStyle}>
              <button onClick={() => { setFormData({...formData, needs_reply: true}); nextStep(); }} style={necessarybuttonStyle}>希望する</button>
              <button onClick={() => { setFormData({...formData, needs_reply: false}); setStep(6); }} style={necessarybuttonStyle}>不要</button>
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={titleStyle}>返信先のメールアドレス</h2>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" style={inputStyle} />
            <button onClick={nextStep} disabled={!formData.email} style={nextButtonStyle}>次へ</button>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {/* Step 6: 詳細記入 */}
        {step === 6 && (
          <div>
            <h2 style={titleStyle}>詳細をご記入ください</h2>
            
            {/* これまで選択した内容のサマリーを表示 */}
            <div style={{ marginBottom: '25px', padding: '20px', background: '#ffffff', borderRadius: '12px', fontSize: '15px', border: '2px solid #e2e8f0', lineHeight: '1.6' }}>
              <div style={{ color: '#4a5568', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>選択内容の確認</div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '4px' }}>
                <span style={{ color: '#718096' }}>相談時期:</span>
                <strong>{CONSULTATION_QUESTIONS.q1.options.find(o => o.id === formData.q1_id)?.text}</strong>
                <span style={{ color: '#718096' }}>目的:</span>
                <strong>{CONSULTATION_QUESTIONS.q2.options.find(o => o.id === formData.q2_id)?.text}</strong>
                <span style={{ color: '#718096' }}>関係箇所:</span>
                <strong>{CONSULTATION_QUESTIONS.q3.options.find(o => o.id === formData.q3_id)?.text}</strong>
                <span style={{ color: '#718096' }}>返信希望:</span>
                <strong>{formData.needs_reply ? `希望する (${formData.email})` : '不要'}</strong>
              </div>
            </div>

            {/* テーマ提案セクション */}
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '15px', marginBottom: '10px', fontWeight: 'bold', color: '#4a5568' }}>
                Q. ご相談の内容に近いテーマを選択してください（必須）
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {getSuggestions(formData.q1_id, formData.q2_id, formData.q3_id).map((text) => {
                  const masterId = Number(Object.keys(SUGGESTION_MASTER).find(key => SUGGESTION_MASTER[Number(key)] === text));
                  const isSelected = formData.selected_suggestion_id === masterId;
                  return (
                    <button 
                      key={text} 
                      onClick={() => setFormData({...formData, selected_suggestion_id: masterId})} 
                      style={{
                        ...buttonStyle,
                        fontSize: '14.5px',
                        textAlign: 'left',
                        padding: '15px',
                        borderColor: isSelected ? '#2d3748' : '#ddd',
                        backgroundColor: isSelected ? '#edf2f7' : '#fff',
                        boxShadow: isSelected ? '0 0 0 1px #2d3748' : 'none'
                      }}
                    >
                      {isSelected ? '✅ ' : ''}{text}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setFormData({...formData, selected_suggestion_id: -1})}
                  style={{
                    ...buttonStyle,
                    fontSize: '14px',
                    textAlign: 'left',
                    padding: '15px',
                    backgroundColor: formData.selected_suggestion_id === -1 ? '#edf2f7' : '#f8f9fa',
                    borderColor: formData.selected_suggestion_id === -1 ? '#2d3748' : '#ddd'
                  }}
                >
                  {formData.selected_suggestion_id === -1 ? '✅ ' : ''}どれも当てはまらない（自由記述のみ）
                </button>
              </div>
            </div>

            <p style={{ fontSize: '15px', marginBottom: '10px', fontWeight: 'bold', color: '#4a5568' }}>
              Q. 具体的な内容をご記入ください
            </p>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="状況や背景など自由にご記入ください" 
              style={{...inputStyle, height: '180px'}} 
            />
            
            <button 
              onClick={handleSubmit} 
              disabled={loading || !formData.message || formData.selected_suggestion_id === 0} 
              style={nextButtonStyle}
            >
              {loading ? '送信中...' : 'この内容で送信する'}
            </button>
            <button onClick={() => formData.needs_reply ? setStep(5) : setStep(4)} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 7 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '30px' }}>{status}</h2>
            <button onClick={() => window.parent.postMessage('CONSULTATION_SUBMITTED', '*')} style={{...nextButtonStyle, background: '#4a5568', maxWidth: '300px', margin: '0 auto'}}>ウィンドウを閉じる</button>
          </div>
        )}
      </div>

      {step <= 6 && (
        <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          {step > 1 && (
            <button onClick={handleReset} style={resetButtonStyle}>最初からやり直す</button>
          )}
          <p style={{ fontSize: '12px', color: '#a0aec0', margin: 0 }}>※入力内容は自動保存されています。</p>
        </div>
      )}
    </div>
    </div>
  );
}

// スタイル定義
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold', color: '#1b212b' };
const nextButtonStyle: React.CSSProperties = { width: '100%', padding: '18px', marginTop: '15px', backgroundColor: '#4378b1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '15px', fontSize: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', marginTop: '10px', boxSizing: 'border-box', outline: 'none' };
const backLinkStyle: React.CSSProperties = { marginTop: '25px', display: 'block', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', width: '100%' ,fontWeight:'bold',fontSize: '16px'};
const resetButtonStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '16px', textDecoration: 'underline', marginBottom: '10px'};