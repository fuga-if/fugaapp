export interface PrefectureRank {
  rank: string;
  title: string;
  threshold: number;
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: PrefectureRank[] = [
  { rank: "S", title: "地理博士", threshold: 18, description: "完璧！日本地図マスター", emoji: "🗾", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "旅行好き", threshold: 14, description: "素晴らしい！よく旅してる？", emoji: "✈️", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "地図が読める", threshold: 10, description: "平均以上の地理力！", emoji: "🗺️", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "一般教養", threshold: 7, description: "基本は押さえてる", emoji: "📍", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "方向音痴？", threshold: 4, description: "もう少し日本を知ろう", emoji: "🤔", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "地理苦手", threshold: 0, description: "地図アプリに頼りすぎ？", emoji: "😵", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): PrefectureRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}

export type QuestionType = "capital" | "famous" | "region" | "neighbor";

export interface PrefectureQuestion {
  question: string;
  answer: string;
  choices: string[];
  type: QuestionType;
  difficulty: number;
}

export const prefectureQuestions: PrefectureQuestion[] = [
  // 県庁所在地（難易度1-2）
  { question: "北海道の県庁所在地は？", answer: "札幌市", choices: ["札幌市", "函館市", "旭川市", "小樽市"], type: "capital", difficulty: 1 },
  { question: "東京都の県庁所在地は？", answer: "新宿区", choices: ["新宿区", "千代田区", "渋谷区", "港区"], type: "capital", difficulty: 1 },
  { question: "大阪府の県庁所在地は？", answer: "大阪市", choices: ["大阪市", "堺市", "東大阪市", "豊中市"], type: "capital", difficulty: 1 },
  { question: "愛知県の県庁所在地は？", answer: "名古屋市", choices: ["名古屋市", "豊田市", "岡崎市", "一宮市"], type: "capital", difficulty: 1 },
  { question: "福岡県の県庁所在地は？", answer: "福岡市", choices: ["福岡市", "北九州市", "久留米市", "大牟田市"], type: "capital", difficulty: 1 },
  { question: "神奈川県の県庁所在地は？", answer: "横浜市", choices: ["横浜市", "川崎市", "相模原市", "藤沢市"], type: "capital", difficulty: 1 },
  { question: "埼玉県の県庁所在地は？", answer: "さいたま市", choices: ["さいたま市", "川口市", "川越市", "所沢市"], type: "capital", difficulty: 1 },
  { question: "千葉県の県庁所在地は？", answer: "千葉市", choices: ["千葉市", "船橋市", "柏市", "市川市"], type: "capital", difficulty: 1 },
  { question: "兵庫県の県庁所在地は？", answer: "神戸市", choices: ["神戸市", "姫路市", "西宮市", "尼崎市"], type: "capital", difficulty: 1 },
  { question: "京都府の県庁所在地は？", answer: "京都市", choices: ["京都市", "宇治市", "舞鶴市", "福知山市"], type: "capital", difficulty: 1 },
  { question: "島根県の県庁所在地は？", answer: "松江市", choices: ["松江市", "出雲市", "浜田市", "益田市"], type: "capital", difficulty: 2 },
  { question: "群馬県の県庁所在地は？", answer: "前橋市", choices: ["前橋市", "高崎市", "太田市", "伊勢崎市"], type: "capital", difficulty: 2 },
  { question: "栃木県の県庁所在地は？", answer: "宇都宮市", choices: ["宇都宮市", "小山市", "栃木市", "足利市"], type: "capital", difficulty: 2 },
  { question: "愛媛県の県庁所在地は？", answer: "松山市", choices: ["松山市", "今治市", "新居浜市", "西条市"], type: "capital", difficulty: 2 },
  { question: "沖縄県の県庁所在地は？", answer: "那覇市", choices: ["那覇市", "沖縄市", "うるま市", "浦添市"], type: "capital", difficulty: 1 },

  // 名物・特産品（難易度2-3）
  { question: "讃岐うどんで有名な県は？", answer: "香川県", choices: ["香川県", "徳島県", "愛媛県", "高知県"], type: "famous", difficulty: 2 },
  { question: "りんごの生産量日本一の県は？", answer: "青森県", choices: ["青森県", "長野県", "岩手県", "山形県"], type: "famous", difficulty: 2 },
  { question: "みかんの生産量日本一の県は？", answer: "和歌山県", choices: ["和歌山県", "愛媛県", "静岡県", "熊本県"], type: "famous", difficulty: 2 },
  { question: "もみじ饅頭で有名な県は？", answer: "広島県", choices: ["広島県", "山口県", "岡山県", "島根県"], type: "famous", difficulty: 2 },
  { question: "牛タンで有名な県は？", answer: "宮城県", choices: ["宮城県", "岩手県", "山形県", "福島県"], type: "famous", difficulty: 2 },
  { question: "明太子で有名な県は？", answer: "福岡県", choices: ["福岡県", "佐賀県", "長崎県", "熊本県"], type: "famous", difficulty: 2 },
  { question: "ずんだ餅で有名な県は？", answer: "宮城県", choices: ["宮城県", "山形県", "岩手県", "秋田県"], type: "famous", difficulty: 3 },
  { question: "きりたんぽで有名な県は？", answer: "秋田県", choices: ["秋田県", "青森県", "岩手県", "山形県"], type: "famous", difficulty: 3 },
  { question: "ほうとうで有名な県は？", answer: "山梨県", choices: ["山梨県", "長野県", "静岡県", "岐阜県"], type: "famous", difficulty: 3 },
  { question: "ちゃんぽんで有名な県は？", answer: "長崎県", choices: ["長崎県", "福岡県", "佐賀県", "熊本県"], type: "famous", difficulty: 2 },

  // 地方・地域（難易度2-3）
  { question: "「東北地方」に含まれないのは？", answer: "新潟県", choices: ["新潟県", "秋田県", "岩手県", "山形県"], type: "region", difficulty: 3 },
  { question: "「関東地方」に含まれるのは？", answer: "茨城県", choices: ["茨城県", "新潟県", "山梨県", "静岡県"], type: "region", difficulty: 2 },
  { question: "「九州地方」に含まれないのは？", answer: "山口県", choices: ["山口県", "福岡県", "大分県", "宮崎県"], type: "region", difficulty: 3 },
  { question: "「四国地方」の県の数は？", answer: "4県", choices: ["4県", "3県", "5県", "6県"], type: "region", difficulty: 1 },
  { question: "「北陸地方」に含まれるのは？", answer: "福井県", choices: ["福井県", "長野県", "岐阜県", "新潟県"], type: "region", difficulty: 3 },

  // 隣接県（難易度3-4）
  { question: "長野県と隣接していない県は？", answer: "石川県", choices: ["石川県", "新潟県", "富山県", "岐阜県"], type: "neighbor", difficulty: 4 },
  { question: "岐阜県と隣接していない県は？", answer: "静岡県", choices: ["静岡県", "愛知県", "三重県", "滋賀県"], type: "neighbor", difficulty: 4 },
  { question: "埼玉県と隣接している県は？", answer: "群馬県", choices: ["群馬県", "神奈川県", "静岡県", "長野県"], type: "neighbor", difficulty: 3 },
  { question: "海に面していない県は？", answer: "栃木県", choices: ["栃木県", "千葉県", "茨城県", "神奈川県"], type: "neighbor", difficulty: 2 },
  { question: "最も多くの県と隣接している県は？", answer: "長野県", choices: ["長野県", "岐阜県", "埼玉県", "新潟県"], type: "neighbor", difficulty: 4 },
];
