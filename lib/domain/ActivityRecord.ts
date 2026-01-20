/**
 * 活動記録エンティティ
 * 引数を7個受け取れるように定義を拡張します。
 */
export class ActivityRecord {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly content: string,      // 3つ目
    public readonly recordDate: string,    // 4つ目
    public readonly isPublished: boolean,  // 5つ目
    public readonly imageUrl: string | null, // 6つ目
    public readonly category: string       // 7つ目
  ) {}

  /**
   * 公開中かどうかを判定
   */
  get isPublic(): boolean {
    return this.isPublished;
  }

  /**
   * 画像が存在するか判定
   */
  get hasImage(): boolean {
    return !!this.imageUrl;
  }
}