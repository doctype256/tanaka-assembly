# オブジェクト指向設計への変更ガイド

このドキュメントは、コードをオブジェクト指向パラダイムに従うようにリファクタリングした内容を説明します。

## 📋 変更の概要

### 変更前（関数ベース）
```javascript
// api.js
export async function getComments(articleTitle) { ... }
export async function createComment(...) { ... }

// utils.js
export function escapeHtml(text) { ... }
export function formatDateJP(...) { ... }

// admin.js
export async function handleLogin(e) { ... }
export function handleLogout() { ... }
```

### 変更後（クラスベース）
```javascript
// api.js
class APIClient {
  async getComments(articleTitle) { ... }
  async createComment(...) { ... }
}

// utils.js
class Utils {
  static escapeHtml(text) { ... }
  static formatDateJP(...) { ... }
}

// admin.js
## Manager クラス群（2026年2月最新）

このプロジェクトでは、管理画面やデータ操作のために複数のManagerクラスを導入しています。各Managerは単一責任原則に基づき、特定のデータや機能を統括します。

### AdminManager
- 管理画面全体の統括。各種Managerを束ね、初期化・イベント管理・データ描画・ログイン/ログアウトなどを担当。
- プロパティ: APIClient, ProfileManager, CareerManager, PDFManager, CommentManager, PostManager, ContactListManager, adminPassword
- メソッド: initialize(), setupEventListeners(), handleLogin(), handleLogout(), renderAllData(), filterComments(), filterContacts(), toggleCommentApproval(), deleteCommentHandler(), togglePostApproval(), deletePostHandler(), deleteContactHandler(), deletePDFHandler()

### ProfileManager
- プロフィールデータの取得・編集・保存を管理。
- プロパティ: api, profile
- メソッド: fetch(), loadForm(), save(), handleUpdate()

### CareerManager
- キャリア履歴の取得・追加・削除・描画を管理。
- プロパティ: api, careers
- メソッド: fetch(), render(), add(), delete(), handleAdd()

### PDFManager
- PDFファイルのアップロード・一覧取得・削除・描画を管理。
- プロパティ: api, pdfs
- メソッド: fetch(), render(), delete(), handleAdd()

### CommentManager
- コメントデータの取得・承認・削除・フィルタリング・統計取得を管理。
- プロパティ: api, allComments, filteredComments
- メソッド: fetchAll(), renderComments(), toggleApproval(), delete(), filter(), getStats()

### PostManager
- ポスト（相談）データの取得・承認・削除・統計取得を管理。
- プロパティ: api, allPosts
- メソッド: fetchAll(), renderPosts(), toggleApproval(), delete(), getStats()

### ContactListManager
- お問い合わせデータの取得・削除・フィルタリング・統計取得を管理。
- プロパティ: api, allContacts, filteredContacts
- メソッド: fetchAll(), renderContacts(), delete(), filter(), getStats()

### ContactManager
- コンタクトフォームページの管理。フォーム初期化・送信処理・ページ初期化を担当。
- メソッド: initializeForm(), handleFormSubmit(), initializePage()

---
各ManagerはAPIClientと連携し、データ取得・操作を行います。AdminManagerが全体を統括し、他のManagerをインスタンス化して管理画面の各機能を実現しています。
```

## 🏗️ クラス設計

### 1. **APIClient** (src/api.js)
- **責務**: すべてのAPI通信を管理
- **メソッド**:
  - `call(endpoint, options)` - 基本的なAPI呼び出し
  - `getComments()`, `getAllComments()` - コメント取得
  - `createComment()`, `updateCommentApproval()`, `deleteComment()` - コメント操作
  - `getAllContacts()`, `createContact()`, `deleteContact()` - お問い合わせ操作
  - `getPosts()`, `createPost()`, `deletePost()` - ポスト操作

### 2. **Utils** (src/utils.js)
- **責務**: 共通ユーティリティ機能の提供
- **特徴**: すべてのメソッドが `static` - インスタンス化不要
- **メソッド**:
  - `escapeHtml(text)` - XSS対策
  - `formatDateJP(dateString)` - 日付フォーマット
  - `showElement()`, `toggleClass()` - DOM操作
  - `showMessage()` - メッセージ表示
  - `getEmptyStateHtml()` - 空状態UI
  - `getQueryParam()` - URLパラメータ取得
  - `getRelativeTime()` - 相対時間表示

### 3. **ProfileManager** (src/admin.js内)
- **責務**: プロフィールデータと編集の管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `profile` - プロフィール情報
- **メソッド**:
  - `fetch(password)` - プロフィール取得
  - `loadForm()` - フォームに値を設定
  - `save(password)` - 更新内容を保存
  - `handleUpdate(e)` - フォーム送信処理

### 4. **CareerManager** (src/admin.js内)
- **責務**: キャリア情報と編集の管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `careers` - キャリア履歴配列
- **メソッド**:
  - `fetch(password)` - キャリア履歴取得
  - `render(container)` - HTML描画
  - `add(year, text, password)` - キャリア追加
  - `delete(id, password)` - キャリア削除
  - `handleAdd(e)` - フォーム送信処理

### 5. **PDFManager** (src/admin.js内)
- **責務**: PDFファイルアップロードと管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `pdfs` - PDF情報配列
- **メソッド**:
  - `fetch(password)` - PDF一覧取得
  - `render(container)` - PDF一覧HTML描画
  - `delete(id, password)` - PDF削除
  - `handleAdd(e)` - ファイルアップロード処理

### 6. **CommentManager** (src/admin.js内)
- **責務**: コメントデータと描画の管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `allComments` - すべてのコメント
  - `filteredComments` - フィルター済みコメント
- **メソッド**:
  - `fetchAll(password)` - コメント一覧取得
  - `renderComments(container)` - HTML描画
  - `toggleApproval()` - 承認ステータス切り替え
  - `delete()` - コメント削除
  - `filter()` - 記事タイトルでフィルタリング
  - `getStats()` - 統計情報取得

### 7. **PostManager** (src/admin.js内)
- **責務**: ポスト（相談）データと描画の管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `allPosts` - すべてのポスト
- **メソッド**:
  - `fetchAll(password)` - ポスト一覧取得
  - `renderPosts(container)` - HTML描画
  - `toggleApproval()` - 承認ステータス切り替え
  - `delete()` - ポスト削除
  - `getStats()` - 統計情報取得

### 8. **ContactListManager** (src/admin.js内)
- **責務**: お問い合わせデータと描画の管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `allContacts` - すべてのお問い合わせ
  - `filteredContacts` - フィルター済みお問い合わせ
- **メソッド**:
  - `fetchAll(password)` - お問い合わせ一覧取得
  - `renderContacts(container)` - HTML描画
  - `delete()` - お問い合わせ削除
  - `filter()` - メールアドレスでフィルタリング
  - `getStats()` - 統計情報取得

### 9. **AdminManager** (src/admin.js内)
- **責務**: 管理画面全体の統括管理
- **プロパティ**:
  - `api` - APIClientインスタンス
  - `profile` - ProfileManagerインスタンス
  - `career` - CareerManagerインスタンス
  - `pdf` - PDFManagerインスタンス
  - `comments` - CommentManagerインスタンス
  - `posts` - PostManagerインスタンス
  - `contacts` - ContactListManagerインスタンス
  - `adminPassword` - 管理者パスワード
- **メソッド**:
  - `initialize()` - 初期化
  - `setupEventListeners()` - イベントリスナー設定
  - `handleLogin()` - ログイン処理
  - `handleLogout()` - ログアウト処理
  - `renderAllData()` - 全データ描画
  - `filterComments()`, `filterContacts()` - フィルタリング
  - `toggleCommentApproval()`, `deleteCommentHandler()` - コメント操作
  - `togglePostApproval()`, `deletePostHandler()` - ポスト操作
  - `deleteContactHandler()` - お問い合わせ削除
  - `deletePDFHandler()` - PDF削除

### 10. **ContactManager** (src/contact.js)
- **責務**: コンタクトフォームページの管理
- **メソッド**:
  - `initializeForm()` - フォーム初期化
  - `handleFormSubmit()` - フォーム送信処理
  - `initializePage()` - ページ初期化

## ✨ オブジェクト指向設計の利点

### 1. **カプセル化 (Encapsulation)**
- 関連するデータとメソッドを一つのクラスにまとめる
- プライベートな状態を保護（例: `#privateField`）
- インターフェースを通じた制御

```javascript
// 例: CommentManager は allComments と filteredComments を管理
class CommentManager {
  allComments = [];
  filteredComments = [];
  
  filter(articleTitle) {
    // 内部状態を管理
    this.filteredComments = this.allComments.filter(...);
  }
}
```

### 2. **再利用性 (Reusability)**
- 複数のページで同じクラスを使用できる
- 例: APIClient は全ページで使用可能

```javascript
// article.html で使用
const api = new APIClient();
const comments = await api.getComments('記事タイトル');

// admin.html で使用
const api = new APIClient();
const allComments = await api.getAllComments(password);
```

### 3. **保守性 (Maintainability)**
- コードが論理的に組織化されている
- 変更の影響範囲が明確
- テストが容易

```javascript
// 変更例: API呼び出しの共通処理を変更
class APIClient {
  async call(endpoint, options = {}) {
    // ここを一度変更すればすべてのAPI呼び出しに反映
    const response = await fetch(url, { ...options, headers });
    ...
  }
}
```

### 4. **拡張性 (Extensibility)**
- 継承を通じた機能拡張が可能
- メソッドのオーバーライド

```javascript
// 例: 特殊なコメント管理者クラスの作成
class ModeratedCommentManager extends CommentManager {
  async autoModerate() {
    // スパムフィルタリング等の追加機能
  }
}
```

### 5. **単一責任原則 (Single Responsibility Principle)**
- 各クラスが一つの責務に集中
  - APIClient: API通信のみ
  - Utils: ユーティリティのみ
  - CommentManager: コメント管理のみ
  - AdminManager: 管理画面統括のみ

## 📁 ファイル構成

```
src/
├── api.js              # APIClient クラス
├── utils.js            # Utils クラス（staticメソッド）
├── contact.js          # ContactManager クラス
├── admin.js            # AdminManager, ProfileManager, CareerManager, 
│                       # PDFManager, CommentManager, PostManager,
│                       # ContactListManager クラス
├── header.js           # ヘッダー処理（既存）
├── style.css           # スタイル（既存）
└── main.ts             # メインファイル（既存）

/
├── admin.html          # 管理画面（プロフィール、キャリア、PDF管理、コメント、ポスト）
├── pdf.html            # PDF 画像表示ページ（従来版）
├── pdf-text.html       # PDF テキスト＆デザイン表示ページ（新）
├── vite-plugin-api.ts  # Vite API ミドルウェア（プロフィール、キャリア、PDF、その他API）
└── vite.config.ts

api/
├── cases.ts
├── comments.ts
└── contacts.ts

db/
└── client.ts          # Turso データベース接続

uploads/               # PDFファイル保存ディレクトリ（新）
├── pdf_*.pdf
└── ...

data/
├── case-files.json
├── db.js
└── static-texts.json  # ナビゲーション、プロフィール、キャリアなど
```

## 🔄 クラス間の相互作用

```
AdminManager (src/admin.js)
├── contains: APIClient
├── contains: ProfileManager
│   └── uses: APIClient
├── contains: CareerManager
│   └── uses: APIClient
├── contains: PDFManager (新)
│   └── uses: APIClient
├── contains: CommentManager
│   └── uses: APIClient
├── contains: PostManager
│   └── uses: APIClient
├── contains: ContactListManager
│   └── uses: APIClient
├── uses: Utils (static)
└── orchestrates: ログイン、タブ、フィルタリング、ファイルアップロード

PDFViewer (pdf.html, pdf-text.html) 🆕
├── uses: PDFManager (ページ初期化)
├── uses: PDF.js (描画・テキスト抽出)
├── features:
│   ├── Canvas レンダリング
│   ├── テキストレイヤー配置
│   ├── ズーム機能
│   ├── ページナビゲーション
│   └── 表示モード切り替え
└── uses: Utils (static)

ContactManager (src/contact.js)
├── contains: APIClient
├── uses: Utils (static)
└── manages: フォーム送信、ページ初期化
```

## 🎯 インスタンス化とグローバルアクセス

### グローバルにアクセス可能にする必要があるもの

HTMLの `onclick` ハンドラーから参照できるように、AdminManager をグローバルにエクスポート：

```javascript
// admin.js 内
document.addEventListener('DOMContentLoaded', () => {
  const manager = new AdminManager();
  manager.initialize();
  window.adminManager = manager; // グローバルに公開
});

// HTML内
<button onclick="window.adminManager.deleteCommentHandler(123)">
  削除
</button>
```

## 💡 使用例

### コメント取得（どのページからでも）
```javascript
const api = new APIClient();
const comments = await api.getComments('記事タイトル');
```

### ユーティリティ使用（staticメソッド）
```javascript
Utils.escapeHtml('危険な<script>');
Utils.formatDateJP('2026-01-23T12:00:00Z');
Utils.showMessage('messageId', 'メッセージ内容', 3000);
```

### コンタクトフォーム送信
```javascript
const manager = new ContactManager();
await manager.api.createContact(name, furigana, email, message);
```

## 🚀 今後の拡張可能性

### 例1: PDF 自動テキスト抽出と検索
```javascript
class SearchablePDFManager extends PDFManager {
  async indexPDFText() {
    // PDF から全テキストを抽出して検索可能にする
    for (const pdf of this.pdfs) {
      const text = await this.extractFullText(pdf.file_path);
      // 検索インデックスを作成
    }
  }
  
  async searchInPDFs(keyword) {
    // すべての PDF から keyword を検索
  }
}
```

### 例2: PDF メタデータの自動抽出
```javascript
class EnrichedPDFManager extends PDFManager {
  async extractMetadata(filePath) {
    // タイトル、作成者、作成日などを自動抽出
    const pdf = await pdfjsLib.getDocument(filePath).promise;
    return await pdf.getMetadata();
  }
}
```

### 例3: コメント審査の自動化
```javascript
class AutoModerationCommentManager extends CommentManager {
  async autoApproveSafeComments() {
    // スパム検出ロジック
  }
}
```

### 例4: API レスポンス キャッシング
```javascript
class CachedAPIClient extends APIClient {
  #cache = new Map();
  
  async call(endpoint, options) {
    const cached = this.#cache.get(endpoint);
    if (cached) return cached;
    
    const result = await super.call(endpoint, options);
    this.#cache.set(endpoint, result);
    return result;
  }
}
```

### 例5: ユーティリティ拡張
```javascript
class ExtendedUtils extends Utils {
  static validateEmail(email) {
    // メールアドレス検証ロジック
  }
  
  static generateId() {
    // ユニークID生成
  }
  
  static sanitizeFileName(name) {
    // ファイル名サニタイズ
  }
}
```

## 📊 設計パターン

- **Singleton パターン**: APIClient（アプリケーション全体で一つ）
- **Manager パターン**: AdminManager（複数のマネージャーを統括）
- **Data Manager パターン**: CommentManager, ContactListManager（データ操作の専門化）
- **Utility クラス**: Utils（共通機能のまとめ）

## ✅ チェックリスト

**基本実装**
- [x] APIClient クラスの作成
- [x] Utils クラスの作成（staticメソッド）
- [x] ContactManager クラスの作成
- [x] CommentManager クラスの作成
- [x] PostManager クラスの作成
- [x] ContactListManager クラスの作成
- [x] AdminManager クラスの作成

**プロフィール・キャリア機能**
- [x] ProfileManager クラスの作成
- [x] CareerManager クラスの作成
- [x] Turso データベース連携
- [x] API エンドポイント実装 (/api/profile, /api/career)
- [x] 管理画面での編集機能

**PDF管理機能** 🆕
- [x] PDFManager クラスの作成
- [x] PDF ファイル保存機能（vite-plugin-api.ts）
- [x] PDF ファイル配信機能（/uploads エンドポイント）
- [x] 管理画面での PDF アップロード
- [x] PDF 一覧表示ページ（pdf.html）
- [x] PDF テキスト抽出ページ（pdf-text.html）🆕
- [x] PDF ズーム機能
- [x] PDF テキスト/画像表示モード切り替え
- [x] URLデコード対応

**その他**
- [x] HTMLのonclick ハンドラーが window.adminManager にアクセス可能
- [x] 開発サーバーで動作確認
- [x] ログイン、フィルタリング、削除、承認機能が正常に動作
- [x] PDF ファイル管理が正常に動作

## 🎓 まとめ

このリファクタリングにより、コードは以下のような改善が実現されました：

1. **構造的**: 関連する機能が論理的にグループ化
2. **保守的**: 変更が限定的な範囲に収まる
3. **拡張可能**: 新機能の追加が容易
4. **テスト可能**: 各クラスを独立してテストできる
5. **再利用可能**: クラスが複数の場所で使用できる

オブジェクト指向設計は、大規模で複雑なアプリケーション開発に非常に有効です。

## 📝 最新機能（2026年1月）

### PDF ファイル管理システム
- **管理画面**での PDF アップロード（Base64 形式で送信）
- **ファイルシステム保存**（/uploads ディレクトリ）
- **URL デコード対応**（日本語ファイル名サポート）
- **テキスト抽出**（PDF.js による自動テキスト取得）
- **デザイン再現**（Canvas レンダリング＋テキストレイヤー）
- **ズーム機能**（0.3倍〜3.0倍対応）
- **表示モード**（テキスト表示/画像表示の切り替え）

### プロフィール＆キャリア管理
- **Turso データベース**（libSQL）との連携
- **API エンドポイント**（/api/profile, /api/career）
- **管理画面での編集**（フォーム入力・保存）
- **ページ表示での自動フェッチ**（静的データからの移行）

### ポスト（ご相談）&コメント管理
- **投稿・承認機能**
- **コメント機能**
- **統計情報表示**

## 🔧 技術スタック

- **フロントエンド**: Vanilla JavaScript（ES6+）、HTML5、CSS3
- **API**: Vite ミドルウェア（開発環境）
- **データベース**: Turso（libSQL）
- **PDF処理**: PDF.js
- **ビルドツール**: Vite
- **ホスティング**: Vercel（予定）

## 🎯 API エンドポイント一覧

### プロフィール関連
- `GET /api/profile` - プロフィール情報取得
- `PUT /api/profile` - プロフィール更新（管理者のみ）

### キャリア関連
- `GET /api/career` - キャリア履歴取得
- `POST /api/career` - キャリア追加（管理者のみ）
- `DELETE /api/career` - キャリア削除（管理者のみ）

### PDF関連
- `GET /api/pdfs` - PDF一覧取得
- `POST /api/pdfs` - PDFアップロード（管理者のみ）
- `DELETE /api/pdfs` - PDF削除（管理者のみ）
- `GET /uploads/*` - PDFファイル配信

### コメント関連
- `GET /api/comments` - コメント取得
- `POST /api/comments` - コメント投稿
- `PUT /api/comments` - コメント承認（管理者のみ）
- `DELETE /api/comments` - コメント削除（管理者のみ）

### ポスト関連
- `GET /api/posts` - ポスト取得
- `POST /api/posts` - ポスト作成
- `PUT /api/posts` - ポスト承認（管理者のみ）
- `DELETE /api/posts` - ポスト削除（管理者のみ）

### お問い合わせ関連
- `GET /api/contacts` - お問い合わせ一覧取得（管理者のみ）
- `POST /api/contacts` - お問い合わせ送信
- `DELETE /api/contacts` - お問い合わせ削除（管理者のみ）
