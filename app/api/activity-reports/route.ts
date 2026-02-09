// app/api/activity-reports/route.ts
import { NextResponse } from "next/server";
import db from "@/db/client";

// 最初に呼び出してテーブルを作成 (アプリケーション起動時に一度だけ実行)
export async function createTables() {
  try {
    // テーブルの作成
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        items TEXT NOT NULL,  -- itemsはJSON形式で保存される前提
        photos TEXT,          -- photosもJSON形式で保存
        updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
      );
    `);
    console.log("Tables created or already exist.");

    // データがすでに存在しているか確認
    const result = await db.execute(`
      SELECT COUNT(*) as count FROM activity_reports;
    `);
    // Value型をnumber型に変換
    const count: number = Number(result.rows[0]?.count);

    // countが0より大きい場合、初期データを挿入しない
    if (count > 0) {
      console.log("Data already exists, skipping initial data insertion.");
      return;
    }

    // 初期データを挿入
    await createInitialData();
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

// 初期データをデータベースに挿入する
async function createInitialData() {
  try {
    // 初期データ
    const initialData = [
      {
        category: "committee",
        title: "危機管理・健康福祉常任委員会",
        year: 2024,
        items: [
          "今年4月の統一地方選挙後、初めての京都府議会となる6月定例会が6月16日から7月5日に開催されました。",
          "その際、わたし“田中しほ”は防災や医療・福祉について議論する「危機管理・健康福祉常任委員会」に所属。看護師としての経験や専門性を活かし、皆さまが日々感じておられる医療・福祉に関する疑問や課題を議会に届けました。",
          "あわせて医療を必要とされる方々が安心できる環境づくりに向けて、医療従事者の待遇改善に関する議論も進めました。"
        ],
        photos: []
      },
      {
        category: "childcare",
        title: "子育て環境の充実に関する特別委員会",
        year: 2025,
        items: [
          "さらに「子育て環境の充実に関する特別委員会」にも所属。0歳児を抱える共働き家庭の当事者として「子育てしやすい環境づくり」に結びつく意見を府政に届けさせていただきました。",
          "「こうした議論が“成果”となるには時間も必要ですし、馴れあいから抜け出せない政治や行政の壁が分厚いのも事実ですが、絶対にあきらめず、子ども“真ん中”社会の実現に向けた活動を続けていきます。"
        ],
        photos: [
          "assets/議員たち.png",
          "assets/定例会.png"
        ]
      },
      {
        category: "reform",
        title: "身を切る改革の断行",
        year: 2026,
        items: [
          "議員報酬のカットを訴える日本維新の会・京都府議会議員団では、それぞれが手取り相当額の20％を党経由で全国の被災地に寄付させてもらっています。",
          "これは行政のムダをなくし、より良いサービスを効率的に提供することをめざす「行政改革」に向けて、それを主導する私たち議員が自ら“身を切る改革”を断行する覚悟をお示しするためでもあり、こうした取り組みは今後も加速していこうと考えています。"
        ],
        photos: []
      },
      {
        category: "childcare",
        title: "子育て環境“日本一”推進戦略",
        year: 2023,
        items: [
          "今年2月の定例会に西脇知事から「令和6年度（2024年度）京都府当初予算案」が提出され、私たち国民民主党・日本維新の会京都府議会議員団をふくむ賛成多数により可決されました（3月22日）。",
          "そこには「子育て環境“日本一”推進戦略」事業費「374億7,773万8,000円」がふくまれており、その分配は①子育てが楽しい風土づくり「1億6,240万6,000円」、②子どもと育つ地域・まちづくり「2億9,821万4,000円」、③若者の希望が叶う環境づくり「5億4,903万2,000円」、④すべての子どもの幸せづくり「69億9,856万3,000円」、⑤その他「294億6,952万3,000円」です。",
          "予算案に賛成した“田中しほ”ではありますが、事業の有益性を皆さんと一緒に注視する必要性を強く感じています。 なかでも特に有益性を高めたい「すべての子どもの幸せづくり」からピックアップした7つの事業について、予算用途を概説させていただきます。ご意見を“田中しほ”までお寄せください。"
        ],
        photos: [
          "assets/子育て推進.png"
        ]
      },
      {
        category: "reform",
        title: "保育士の皆さんに京都で働きたいと思ってもらうための取り組みを！！",
        year: 2022,
        items: [
          "全国各地と同様、京都も保育士が不足しています。その原因のひとつは責任の重さに比べ、給与等の待遇が充分ではないことです。こうした課題をふまえ、より多くの保育士さんたちに「京都で働きたい」と思ってもらえる取り組みとして、給与水準の引き上げに関することを質問しました。",
          "現在、京都府の保育士の年間平均給与は全国平均を54万円ほど上回っており、この7年間で人数も2,400人ほど増えている。その一方、保育士の給与水準は全職種の平均に比べて低く、労働環境と共に引き続き改善していきたい。",
          "知事の答弁は前向きでしたが、 今後も満1歳の娘を保育園へ預けている当事者としての感謝を込め、 保育士の皆さんを支援する施策の実現を訴え続けようと思いました。"
        ],
        photos: []
      },
      {
        category: "topics",
        title: "京都府庁の保育ルームを利用させてもらいました",
        year: 2021,
        items: [
          "京都府庁には各種申請の手続きなどで来庁される方が利用できる「保育ルーム」があり、わたし“田中しほ”も定例会の出席に際し、利用させていただきました。",
          "子育て中の皆さんも議会の傍聴などに際し、利用されることをおすすめします。"
        ],
        photos: [
          "assets/topics.png"
        ]
      }
    ];

    // 初期データをDBに挿入
    for (const report of initialData) {
      await db.execute(`
        INSERT INTO activity_reports (category, title, year, items, photos, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'));
      `, [
        report.category,
        report.title,
        report.year,
        JSON.stringify(report.items),
        report.photos.length > 0 ? JSON.stringify(report.photos) : null
      ]);
    }

    console.log("Initial data inserted into the database.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
}



// 最初に呼び出す (アプリケーション初期化時に実行)
createTables();

// GET メソッド: 活動報告の取得
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    // CORS設定 (これをapp全体に適用したい場合は、middleware.ts等で設定)
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    if (password) {
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword || password !== adminPassword) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers }
        );
      }
    }

    // idパラメータがあればそのidのみ取得、なければ全件取得
    const id = searchParams.get("id");
    let result;
    if (id) {
      result = await db.execute(`
        SELECT id, category, title, year, items, photos, updated_at
        FROM activity_reports
        WHERE id = ?
      `, [id]);
    } else {
      result = await db.execute(`
        SELECT id, category, title, year, items, photos, updated_at
        FROM activity_reports
        ORDER BY year DESC, id DESC;
      `);
    }

    // 結果を整形して返す
    const reports = result.rows.map((row: any) => ({
      id: row.id,
      category: row.category,
      title: row.title,
      year: row.year,
      items: JSON.parse(row.items),
      photos: row.photos ? JSON.parse(row.photos) : [],
      updated_at: row.updated_at || null,
    }));

    return new NextResponse(JSON.stringify({ success: true, reports }), { status: 200, headers });
  } catch (error) {
    console.error("Error fetching activity reports:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// POST メソッド: 活動報告の保存
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST body:", body); // 追加: 受信データをログ出力
    const { category, title, year, items, photos, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return new NextResponse(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!category || !title || !year || !items || !Array.isArray(items)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "必要なデータが不足しています。" }),
        { status: 400 }
      );
    }

    // itemsやphotosをJSON形式で保存する
    const itemsJSON = JSON.stringify(items);
    const photosJSON = photos ? JSON.stringify(photos) : null;

    // データベースに新しい活動報告を保存
    await db.execute(`
      INSERT INTO activity_reports (category, title, year, items, photos, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'));
    `, [category, title, year, itemsJSON, photosJSON]);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "活動報告が保存されました。",
        data: { category, title, year, items, photos },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving activity report:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "保存に失敗しました。" }),
      { status: 500 }
    );
  }
}

// PATCH メソッド: 活動報告の編集（updated_atも更新）
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, category, title, year, items, photos, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return new NextResponse(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!id || !category || !title || !year || !items || !Array.isArray(items)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "必要なデータが不足しています。" }),
        { status: 400 }
      );
    }

    const itemsJSON = JSON.stringify(items);
    const photosJSON = photos ? JSON.stringify(photos) : null;

    // データベースで該当レコードを更新し、updated_atも現在時刻に
    await db.execute(`
      UPDATE activity_reports
      SET category = ?, title = ?, year = ?, items = ?, photos = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?;
    `, [category, title, year, itemsJSON, photosJSON, id]);

    return new NextResponse(
      JSON.stringify({ success: true, message: "活動報告が更新されました。" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating activity report:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "更新に失敗しました。" }),
      { status: 500 }
    );
  }
}

// DELETE メソッド: 活動報告の削除
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return new NextResponse(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "id is required" }),
        { status: 400 }
      );
    }

    // データベースから活動報告を削除
    await db.execute(`
      DELETE FROM activity_reports WHERE id = ?;
    `, [id]);

    return new NextResponse(
      JSON.stringify({ success: true, message: "活動報告が削除されました。" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting activity report:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "削除に失敗しました。" }),
      { status: 500 }
    );
  }
}