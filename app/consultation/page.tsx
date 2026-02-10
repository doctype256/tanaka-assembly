// directory: app/consultation/page.tsx
"use client";

import React, { useState, useEffect } from 'react';

// 選択肢の定義
const QUESTIONS = {
  target: ["子供関連", "その他", "提案やお問い合わせの方はこちら"],
  place: ["学校関連", "役所関連", "家"],
  content: ["お金", "相続", "気持ち", "その他"]
};

// 保存用キーの定数化
const STORAGE_KEY = 'consultation_form_draft';

/**
 * TestConsultationPage: ステップ形式の相談フォーム
 * PC環境での余白を最適化するため、コンテナ幅をレスポンシブに修正。
 */
export default function TestConsultationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期データ構造
  const initialFormData = {
    target_type: '',
    place_type: '未選択（スキップ）',
    content_type: '未選択（スキップ）',
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
      const draft = {
        savedStep: step,
        savedData: formData
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, step, isInitialized]);

  // 進捗率の計算ロジック: 送信完了(Step 7)を 100% とする
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
    setLoading(true);
    setStatus('送信中...');
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  if (!isInitialized) return null;

  return (
    /* 修正: maxWidth を 100% にし、左右の padding でレスポンシブに対応 */
    <div style={{ padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {step <= 7 && (
        <div style={{ marginBottom: '30px', fontSize: '12px', color: '#666' }}>
          進捗: {progressPercent}%
          <div style={{ width: '100%', height: '6px', background: '#eee', marginTop: '8px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#2d3748', transition: '0.3s ease-in-out' }}></div>
          </div>
        </div>
      )}

      <div style={{ minHeight: '400px' }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Q1. 何についての相談ですか？</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              {QUESTIONS.target.map((opt) => {
                const isSpecial = opt === "提案やお問い合わせの方はこちら";
                return (
                  <button 
                    key={opt} 
                    onClick={() => {
                      setFormData({ 
                        ...initialFormData, 
                        target_type: opt 
                      });
                      isSpecial ? setStep(6) : nextStep();
                    }} 
                    style={{
                      ...buttonStyle,
                      gridColumn: isSpecial ? '1 / -1' : 'auto',
                      marginTop: isSpecial ? '20px' : '0px',
                      backgroundColor: isSpecial ? '#f8f9fa' : '#fff',
                      borderColor: isSpecial ? '#cbd5e0' : '#ddd',
                      textAlign: 'center'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Q2. 場所や対象はどこですか？</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {QUESTIONS.place.map(opt => (
                <button key={opt} onClick={() => { setFormData({...formData, place_type: opt}); nextStep(); }} style={{...buttonStyle, textAlign: 'center'}}>{opt}</button>
              ))}
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Q3. 悩みのジャンルを教えてください</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {QUESTIONS.content.map(opt => (
                <button key={opt} onClick={() => { setFormData({...formData, content_type: opt}); nextStep(); }} style={{...buttonStyle, textAlign: 'center'}}>{opt}</button>
              ))}
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Q4. 返信を希望されますか？</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <button onClick={() => { setFormData({...formData, needs_reply: true}); nextStep(); }} style={{...buttonStyle, textAlign: 'center'}}>希望する</button>
              <button onClick={() => { setFormData({...formData, needs_reply: false}); setStep(6); }} style={{...buttonStyle, textAlign: 'center'}}>不要</button>
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Q5. 返信先のメールアドレス</h2>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" style={inputStyle} />
            <button onClick={nextStep} disabled={!formData.email} style={nextButtonStyle}>次へ</button>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>詳細をご記入ください</h2>
            <div style={{ marginBottom: '20px', padding: '20px', background: '#edf2f7', borderRadius: '12px', fontSize: '15px', lineHeight: '1.8' }}>
              <div style={{ color: '#4a5568', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #cbd5e0', paddingBottom: '8px' }}>
                入力内容の確認
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '5px' }}>
                <span>相談対象：</span><strong>{formData.target_type}</strong>
                {formData.target_type !== "提案やお問い合わせの方はこちら" && (
                  <>
                    <span>場所・対象：</span><strong>{formData.place_type}</strong>
                    <span>ジャンル：</span><strong>{formData.content_type}</strong>
                  </>
                )}
                <span>返信希望：</span><strong>{formData.needs_reply ? `希望する (${formData.email})` : '不要'}</strong>
              </div>
            </div>

            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="具体的な内容をご記入ください" style={{...inputStyle, height: '200px'}} />
            <button onClick={handleSubmit} disabled={loading || !formData.message} style={nextButtonStyle}>
              {loading ? '送信中...' : 'この内容で送信する'}
            </button>
            <button 
              onClick={() => {
                if (formData.target_type === "提案やお問い合わせの方はこちら") {
                  setStep(1);
                } else {
                  formData.needs_reply ? setStep(5) : setStep(4);
                }
              }} 
              style={backLinkStyle}
            >
              戻る
            </button>
          </div>
        )}

        {step === 7 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '30px' }}>{status}</h2>
            <button 
              onClick={() => window.parent.postMessage('CONSULTATION_SUBMITTED', '*')} 
              style={{...nextButtonStyle, background: '#4a5568', maxWidth: '300px', margin: '0 auto'}}
            >
              ウィンドウを閉じる
            </button>
          </div>
        )}
      </div>

      {step <= 6 && (
        <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          {step > 1 && (
            <button 
              onClick={handleReset} 
              style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', marginBottom: '10px' }}
            >
              最初からやり直す
            </button>
          )}
          <p style={{ fontSize: '12px', color: '#a0aec0', margin: 0 }}>
            ※入力内容は自動保存されています。
          </p>
        </div>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = { padding: '20px', fontSize: '16px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '12px', width: '100%', backgroundColor: '#fff', transition: 'all 0.2s' };
const nextButtonStyle: React.CSSProperties = { width: '100%', padding: '18px', marginTop: '15px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '15px', fontSize: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', marginTop: '10px', boxSizing: 'border-box', outline: 'none' };
const backLinkStyle: React.CSSProperties = { marginTop: '25px', display: 'block', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', width: '100%' };