import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

/**
 * ファイルストレージ・クラス
 * * 役割: 物理的なファイルの保存・削除といった「外部リソース操作」に専念します。
 * メリット: 保存先をローカルからS3などに変更する場合、このクラスを修正するだけで済みます。
 */
export class FileStorage {
  // 保存先ディレクトリの絶対パス（プロジェクトルート/public/uploads）
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

  /**
   * 画像ファイルをサーバーのディスクに保存します
   * @param file ブラウザから送られてきたFileオブジェクト
   * @returns 保存されたファイルの公開URL（例: /uploads/12345-image.jpg）
   */
  async save(file: File): Promise<string | null> {
    // ファイルが存在しない、または空の場合は保存処理を行わない
    if (!file || file.size === 0) return null;

    try {
      // 保存先ディレクトリが存在しない場合は作成する（再帰的に作成）
      await mkdir(this.uploadDir, { recursive: true });

      // ファイル名の衝突を防ぐため、タイムスタンプを付与
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(this.uploadDir, fileName);

      // FileオブジェクトをBufferに変換して書き込み
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // クライアント側（ブラウザ）からアクセス可能なURL形式で返す
      return `/uploads/${fileName}`;
    } catch (error) {
      // ログ出力のみ行い、呼び出し元にはnullを返して処理を継続させる
      console.error("📸 FileStorage Save Error:", error);
      return null;
    }
  }

  /**
   * 指定されたURLのファイルをディスクから物理削除します
   * @param url 削除対象のファイルURL（例: /uploads/filename.jpg）
   */
  async delete(url: string | null): Promise<void> {
    if (!url) return;

    try {
      // URLから物理的なファイルパスを生成
      const filePath = path.join(process.cwd(), 'public', url);
      
      // ファイルを削除
      await unlink(filePath);
      console.log(`✅ 物理ファイルを削除しました: ${filePath}`);
    } catch (error: any) {
      /**
       * ENOENT（ファイルが存在しない）エラーの場合は、
       * すでに削除されているとみなして正常終了させる。
       */
      if (error.code !== 'ENOENT') {
        console.error("❌ FileStorage Delete Error:", error);
      }
    }
  }
}