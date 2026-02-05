// app/api/contact/route.ts
import APIClient from '@/lib/apiClient';


interface StaticTexts {
  contact: {
    title: string;
    text: string;
    privacy?: {
      body: string[];
    };
  };
  rinen?: {
    name: string;
  };
}

class ContactManager {
  private api: APIClient;

  constructor() {
    this.api = new APIClient();
  }

  /**
   * お問い合わせフォームの初期化と送信処理
   */
  // initializeForm(): void {
  //   const form = document.getElementById('contact-form') as HTMLFormElement;
  //   if (!form) return;

  //   form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  // }

  /**
   * フォーム送信ハンドラー
   */
  async handleFormSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const furigana = (document.getElementById('furigana') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const message = (document.getElementById('message') as HTMLTextAreaElement).value;

    console.log('フォーム送信:', { name, furigana, email, message });

    try {
      console.log('API リクエスト送信中...');
      await this.api.createContact(name, furigana, email, message);

      console.log('送信成功、リダイレクト中...');
      window.location.href = 'thanks.html?type=contact';
    } catch (err) {
      console.error('Error:', err);
      alert('送信中にエラーが発生しました。時間をおいて再度お試しください。');
    }
  }

  /**
   * ページ情報の読み込みと初期化
   */
  async initializePage(): Promise<void> {
    try {
      // const response = await fetch('data/static-texts.json');
      // const data: StaticTexts = await response.json();
      // const contact = data.contact;

      // // タイトル
      // document.title = contact.title;

      // // ヘッダー名
      // if (data.rinen && data.rinen.name) {
      //   (document.getElementById('header-name') as HTMLElement).textContent = data.rinen.name;
      // }

      // // ページヘッダー
      // (document.getElementById('contact-title') as HTMLElement).textContent = contact.title;
      // (document.getElementById('contact-text') as HTMLElement).textContent = contact.text;

      // // プライバシーポリシー
      // if (contact.privacy) {
      //   const bodyWrapper = document.getElementById('privacy-body') as HTMLElement;
      //   bodyWrapper.innerHTML = '';

      //   contact.privacy.body.forEach(text => {
      //     const p = document.createElement('p');
      //     p.textContent = text;
      //     bodyWrapper.appendChild(p);
      //   });
      // }

      //this.initializeForm();
    } catch (error) {
      console.error('Failed to initialize contact page:', error);
    }
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  const manager = new ContactManager();
  manager.initializePage();
});
