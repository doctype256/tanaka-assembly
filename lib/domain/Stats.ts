/**
 * 統計データ・エンティティ
 * * オブジェクト指向における「ドメインモデル」の役割を果たします。
 * 単なる連想配列(Object)ではなくクラスにすることで、データに関連する
 * ロジック（例：未読の有無、前月比の計算など）を一箇所に集約できます。
 */
export class Stats {
  /**
   * @param records 公開済みレコードの総数
   * @param contacts 未処理のお問い合わせ件数
   */
  constructor(
    public readonly records: number,
    public readonly contacts: number
  ) {
    // コンストラクタで「不正な値」を防ぐバリデーションも可能
    if (records < 0 || contacts < 0) {
      console.warn("統計データに負の値がセットされました。");
    }
  }

  /**
   * ビジネスロジック：対応が必要な項目があるかどうかを判定
   * UI側で「if (stats.contacts > 0)」と書く代わりに、
   * 「if (stats.hasAlert())」と書けるようになり、意図が明確になります。
   */
  public hasAlert(): boolean {
    return this.contacts > 0;
  }

  /**
   * 将来的な拡張例：
   * 複数の統計データを比較したり、表示用にフォーマットするメソッドも
   * このクラス内に定義していくことで、tsx側の記述を減らせます。
   */
}