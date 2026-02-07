export type OtakuType = 'gachi-koi' | 'hako-oshi' | 'archive' | 'shokunin' | 'teetee' | 'kosan';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<OtakuType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "推しの配信、どれくらい見る？",
    options: [
      { label: "ほぼ全部リアタイ", scores: { 'gachi-koi': 3 } },
      { label: "箱の配信を巡回してる", scores: { 'hako-oshi': 3 } },
      { label: "アーカイブで気になるやつだけ", scores: { 'archive': 3 } },
      { label: "面白そうな企画だけ選んで", scores: { 'shokunin': 3 } },
      { label: "コラボ配信は絶対見る", scores: { 'teetee': 3 } },
      { label: "新人配信をチェックしがち", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 2,
    text: "スパチャ/メンバーシップ、どうしてる？",
    options: [
      { label: "推しには定期的に投げる", scores: { 'gachi-koi': 3 } },
      { label: "複数人にちょこちょこ", scores: { 'hako-oshi': 3 } },
      { label: "基本無課金、たまに投げる", scores: { 'archive': 2, 'shokunin': 1 } },
      { label: "記念配信には投げる", scores: { 'teetee': 3 } },
      { label: "小さいVには投げたくなる", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 3,
    text: "切り抜きについてどう思う？",
    options: [
      { label: "本配信派、切り抜きは物足りない", scores: { 'gachi-koi': 3 } },
      { label: "色んな人の切り抜きを見る", scores: { 'hako-oshi': 3 } },
      { label: "切り抜きメインで追ってる", scores: { 'archive': 3 } },
      { label: "編集のうまい切り抜きは評価する", scores: { 'shokunin': 3 } },
      { label: "てぇてぇシーンの切り抜きは保存", scores: { 'teetee': 3 } },
      { label: "自分で切り抜き作ったことある", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 4,
    text: "推しが増えそうなとき、どうする？",
    options: [
      { label: "浮気はしない、一途", scores: { 'gachi-koi': 3 } },
      { label: "増えても全員推す", scores: { 'hako-oshi': 3 } },
      { label: "自然に任せる", scores: { 'archive': 3 } },
      { label: "「なぜハマったか」を分析する", scores: { 'shokunin': 3 } },
      { label: "関係性込みで推しが増える", scores: { 'teetee': 3 } },
      { label: "新しい子を発掘したい欲がある", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 5,
    text: "コラボ配信について",
    options: [
      { label: "推しメインじゃないと興味薄い", scores: { 'gachi-koi': 3 } },
      { label: "大型コラボ大好き", scores: { 'hako-oshi': 3 } },
      { label: "面白そうなら見る", scores: { 'archive': 2, 'shokunin': 1 } },
      { label: "企画の完成度を評価する", scores: { 'shokunin': 3 } },
      { label: "コンビ・トリオの絡みが本体", scores: { 'teetee': 3 } },
      { label: "知らない人を発見する機会", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 6,
    text: "Vtuberを見始めたきっかけは？",
    options: [
      { label: "一人の推しに出会って沼落ち", scores: { 'gachi-koi': 3 } },
      { label: "事務所/グループにハマった", scores: { 'hako-oshi': 3 } },
      { label: "たまたま見た動画から", scores: { 'archive': 3 } },
      { label: "エンタメとして興味を持った", scores: { 'shokunin': 3 } },
      { label: "てぇてぇ切り抜きから", scores: { 'teetee': 3 } },
      { label: "初期からV文化を追ってる", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 7,
    text: "推しの休止・引退発表、どうなる？",
    options: [
      { label: "立ち直れない、ガチ泣き", scores: { 'gachi-koi': 2, 'teetee': 1 } },
      { label: "悲しいけど他も推す", scores: { 'hako-oshi': 3 } },
      { label: "寂しいけど受け入れる", scores: { 'archive': 3 } },
      { label: "Vtuber業界の動向として考察", scores: { 'shokunin': 3 } },
      { label: "関係性のロスがつらい", scores: { 'teetee': 3 } },
      { label: "転生先を追う", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 8,
    text: "SNSでの推し活、どうしてる？",
    options: [
      { label: "推しのツイートは即反応", scores: { 'gachi-koi': 3 } },
      { label: "複数人をリスト管理", scores: { 'hako-oshi': 3 } },
      { label: "たまに見る程度", scores: { 'archive': 3 } },
      { label: "考察や感想を投稿する", scores: { 'shokunin': 2, 'kosan': 1 } },
      { label: "てぇてぇポストを保存・RT", scores: { 'teetee': 3 } },
      { label: "新人Vを紹介しがち", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 9,
    text: "Vtuberのどこが好き？",
    options: [
      { label: "推しの存在そのもの", scores: { 'gachi-koi': 3 } },
      { label: "多様なキャラクターの世界", scores: { 'hako-oshi': 3 } },
      { label: "気軽に楽しめるところ", scores: { 'archive': 3 } },
      { label: "配信というエンタメ形式", scores: { 'shokunin': 3 } },
      { label: "関係性・ドラマ性", scores: { 'teetee': 3 } },
      { label: "新しい才能が出てくるところ", scores: { 'kosan': 3 } },
    ],
  },
  {
    id: 10,
    text: "あなたの推し活スタイルは？",
    options: [
      { label: "一途に深く", scores: { 'gachi-koi': 3 } },
      { label: "広く愛を注ぐ", scores: { 'hako-oshi': 3 } },
      { label: "マイペースに楽しむ", scores: { 'archive': 3 } },
      { label: "分析しながら楽しむ", scores: { 'shokunin': 3 } },
      { label: "関係性を見守る", scores: { 'teetee': 3 } },
      { label: "発掘・育成する喜び", scores: { 'kosan': 3 } },
    ],
  },
];
