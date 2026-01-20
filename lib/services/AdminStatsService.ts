import { Stats } from '../domain/Stats';

/**
 * 管理画面統計サービス
 * * UI(tsx)から「どのようにデータを取得するか」という技術的な詳細を隠蔽します。
 * これにより、APIのURLが変わったり、fetchから別のライブラリ(axios等)に
 * 変更したりする場合も、このクラスのみの修正で済むようになります。
 */
export class AdminStatsService {
  /**
   * サーバーから最新の統計情報を取得し、Statsオブジェクトに変換して返します。
   * @returns Stats インスタンス
   */
  async getDashboardStats(): Promise<Stats> {
    const API_URL = '/api/admin/stats';

    try {
      // 1. 通信の実行
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      // 2. エラーハンドリング（HTTPステータスチェック）
      if (!res.ok) {
        throw new Error(`APIレスポンスエラー: ${res.status}`);
      }
      
      // 3. 生データの解析
      const data = await res.json();
      
      /**
       * 4. オブジェクトの生成（マッピング）
       * サーバーから届いた「ただのデータ」に、Statsクラスの「振る舞い」を
       * 与えてインスタンス化します。
       */
      return new Stats(
        data.records || 0, 
        data.contacts || 0
      );

    } catch (error) {
      /**
       * 5. 例外処理
       * 通信失敗時でもUIを壊さないよう、安全な初期値を返します。
       * 実際の開発ではここでエラーログ送信(Sentry等)を行うことが多いです。
       */
      console.error("📊 StatsService Error:", error);
      return new Stats(0, 0); 
    }
  }
}

