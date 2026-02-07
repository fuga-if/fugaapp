export interface KanjiOrderRank {
  rank: string;
  title: string;
  threshold: number; // 正解数以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: KanjiOrderRank[] = [
  { rank: "S", title: "書道の達人", threshold: 14, description: "完璧な書き順！お手本レベル", emoji: "🖌️", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "習字上手", threshold: 11, description: "素晴らしい！正しい書き順が身についてる", emoji: "✒️", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "しっかり者", threshold: 8, description: "平均以上！小学校の先生が喜ぶ", emoji: "📝", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "なんとなく派", threshold: 5, description: "だいたい合ってるけど時々怪しい", emoji: "🤔", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "自己流マスター", threshold: 3, description: "書き順？気にしたことない…", emoji: "✏️", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "フリースタイル書道", threshold: 0, description: "書ければいいじゃん！の精神", emoji: "🎨", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): KanjiOrderRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}

// 書き順問題データ
// 各問題は漢字と「N画目は？」の形式で4択
export interface StrokeQuestion {
  kanji: string;
  strokeCount: number; // 総画数
  askStroke: number; // 何画目を聞くか
  // SVGのパスデータで選択肢を表示（正解とダミー3つ）
  correctDirection: string; // 正解の説明（例: "横線（左→右）"）
  choices: string[]; // 4択の説明
  difficulty: number; // 1-5
}

export const strokeQuestions: StrokeQuestion[] = [
  // 難易度1
  { kanji: "十", strokeCount: 2, askStroke: 1, correctDirection: "横（左→右）", choices: ["横（左→右）", "縦（上→下）", "横（右→左）", "縦（下→上）"], difficulty: 1 },
  { kanji: "人", strokeCount: 2, askStroke: 1, correctDirection: "左はらい", choices: ["左はらい", "右はらい", "横（左→右）", "縦（上→下）"], difficulty: 1 },
  { kanji: "大", strokeCount: 3, askStroke: 1, correctDirection: "横（左→右）", choices: ["横（左→右）", "左はらい", "右はらい", "縦（上→下）"], difficulty: 1 },
  { kanji: "川", strokeCount: 3, askStroke: 1, correctDirection: "左の縦線", choices: ["左の縦線", "中の縦線", "右の縦線", "横線"], difficulty: 1 },
  { kanji: "山", strokeCount: 3, askStroke: 1, correctDirection: "縦（中央）", choices: ["縦（中央）", "左の折れ", "右の縦線", "横線"], difficulty: 1 },

  // 難易度2
  { kanji: "田", strokeCount: 5, askStroke: 1, correctDirection: "左の縦線（上→下）", choices: ["左の縦線（上→下）", "上の横線", "右の縦線", "中の横線"], difficulty: 2 },
  { kanji: "右", strokeCount: 5, askStroke: 1, correctDirection: "左はらい（ノ）", choices: ["左はらい（ノ）", "横線（一）", "口の最初", "縦線"], difficulty: 2 },
  { kanji: "左", strokeCount: 5, askStroke: 1, correctDirection: "横線（一）", choices: ["横線（一）", "左はらい（ノ）", "口の最初", "縦線"], difficulty: 2 },
  { kanji: "必", strokeCount: 5, askStroke: 1, correctDirection: "中央の点", choices: ["中央の点", "左はらい", "右はらい", "左の点"], difficulty: 2 },
  { kanji: "飛", strokeCount: 9, askStroke: 1, correctDirection: "横折れの横部分", choices: ["横折れの横部分", "縦線", "左はらい", "右上の点"], difficulty: 2 },

  // 難易度3
  { kanji: "書", strokeCount: 10, askStroke: 1, correctDirection: "一番上の横線", choices: ["一番上の横線", "縦線", "2番目の横線", "左はらい"], difficulty: 3 },
  { kanji: "馬", strokeCount: 10, askStroke: 1, correctDirection: "縦線（上→下）", choices: ["縦線（上→下）", "横線", "折れ", "点"], difficulty: 3 },
  { kanji: "成", strokeCount: 6, askStroke: 1, correctDirection: "横線", choices: ["横線", "左はらい", "はね", "点（戈の点）"], difficulty: 3 },
  { kanji: "世", strokeCount: 5, askStroke: 1, correctDirection: "縦線（左）", choices: ["縦線（左）", "横線（上）", "縦線（中）", "横線（下）"], difficulty: 3 },
  { kanji: "発", strokeCount: 9, askStroke: 1, correctDirection: "右上へのはらい", choices: ["右上へのはらい", "左はらい", "点", "横線"], difficulty: 3 },

  // 難易度4
  { kanji: "臣", strokeCount: 7, askStroke: 1, correctDirection: "横線（上）", choices: ["横線（上）", "縦線（左）", "折れ", "中の横線"], difficulty: 4 },
  { kanji: "凸", strokeCount: 5, askStroke: 1, correctDirection: "左の縦線（上→下）", choices: ["左の縦線（上→下）", "横線", "中央の縦線", "右の縦線"], difficulty: 4 },
  { kanji: "凹", strokeCount: 5, askStroke: 1, correctDirection: "左の縦線（上→下）", choices: ["左の縦線（上→下）", "横線", "中央の縦線", "底の横線"], difficulty: 4 },
  { kanji: "耳", strokeCount: 6, askStroke: 1, correctDirection: "横線（上）", choices: ["横線（上）", "縦線（左）", "横線（中）", "縦線（右）"], difficulty: 4 },
  { kanji: "長", strokeCount: 8, askStroke: 1, correctDirection: "縦線", choices: ["縦線", "横線", "左はらい", "右はらい"], difficulty: 4 },

  // 難易度5
  { kanji: "鬱", strokeCount: 29, askStroke: 1, correctDirection: "左上の横線", choices: ["左上の横線", "縦線", "木の横線", "点"], difficulty: 5 },
  { kanji: "鑑", strokeCount: 23, askStroke: 1, correctDirection: "金へんの左はらい", choices: ["金へんの左はらい", "金へんの横線", "臣の横線", "皿の縦線"], difficulty: 5 },

  // 難易度1（追加）
  { kanji: "口", strokeCount: 3, askStroke: 1, correctDirection: "縦線（左）", choices: ["縦線（左）", "横線（上）", "横線（下）", "縦線（右）"], difficulty: 1 },
  { kanji: "日", strokeCount: 4, askStroke: 1, correctDirection: "縦線（左）", choices: ["縦線（左）", "横線（上）", "中の横線", "縦線（右）"], difficulty: 1 },
  { kanji: "木", strokeCount: 4, askStroke: 1, correctDirection: "横線", choices: ["横線", "縦線", "左はらい", "右はらい"], difficulty: 1 },
  { kanji: "火", strokeCount: 4, askStroke: 1, correctDirection: "左の点", choices: ["左の点", "右の点", "左はらい", "右はらい"], difficulty: 1 },
  { kanji: "水", strokeCount: 4, askStroke: 1, correctDirection: "縦のはね", choices: ["縦のはね", "左はらい（上）", "左はらい（下）", "右はらい"], difficulty: 1 },
  { kanji: "金", strokeCount: 8, askStroke: 1, correctDirection: "左はらい（ノ）", choices: ["左はらい（ノ）", "横線", "縦線", "右はらい"], difficulty: 1 },
  { kanji: "土", strokeCount: 3, askStroke: 1, correctDirection: "横線（短い方）", choices: ["横線（短い方）", "縦線", "横線（長い方）", "点"], difficulty: 1 },

  // 難易度2（追加）
  { kanji: "名", strokeCount: 6, askStroke: 1, correctDirection: "左はらい（ノ）", choices: ["左はらい（ノ）", "口の縦線", "横線", "口の横線"], difficulty: 2 },
  { kanji: "気", strokeCount: 6, askStroke: 1, correctDirection: "横線（一番上）", choices: ["横線（一番上）", "縦線", "ノ（はらい）", "点"], difficulty: 2 },
  { kanji: "花", strokeCount: 7, askStroke: 1, correctDirection: "横線（草かんむり）", choices: ["横線（草かんむり）", "縦線（左）", "縦線（右）", "化の左はらい"], difficulty: 2 },
  { kanji: "学", strokeCount: 8, askStroke: 1, correctDirection: "小の点（左上）", choices: ["小の点（左上）", "横線", "冖の縦（左）", "子の横線"], difficulty: 2 },
  { kanji: "年", strokeCount: 6, askStroke: 1, correctDirection: "左はらい（短い）", choices: ["左はらい（短い）", "横線（上）", "横線（中）", "縦線"], difficulty: 2 },
  { kanji: "万", strokeCount: 3, askStroke: 1, correctDirection: "横線", choices: ["横線", "左はらい", "折れ", "点"], difficulty: 2 },
  { kanji: "九", strokeCount: 2, askStroke: 1, correctDirection: "左はらい（ノ）", choices: ["左はらい（ノ）", "横折れ曲がり", "縦線", "横線"], difficulty: 2 },

  // 難易度3（追加）
  { kanji: "道", strokeCount: 12, askStroke: 1, correctDirection: "首の点（上左）", choices: ["首の点（上左）", "しんにょうの点", "横線", "縦線"], difficulty: 3 },
  { kanji: "食", strokeCount: 9, askStroke: 1, correctDirection: "左はらい（ノ）", choices: ["左はらい（ノ）", "横線", "点", "縦線"], difficulty: 3 },
  { kanji: "校", strokeCount: 10, askStroke: 1, correctDirection: "横線（木へん）", choices: ["横線（木へん）", "縦線（木へん）", "交の点", "左はらい"], difficulty: 3 },
  { kanji: "語", strokeCount: 14, askStroke: 1, correctDirection: "ごんべんの点", choices: ["ごんべんの点", "横線（上）", "ごんべんの横", "口の縦"], difficulty: 3 },
  { kanji: "時", strokeCount: 10, askStroke: 1, correctDirection: "日の縦線（左）", choices: ["日の縦線（左）", "日の横線（上）", "寺の横線", "寺の縦線"], difficulty: 3 },
  { kanji: "読", strokeCount: 14, askStroke: 1, correctDirection: "ごんべんの点", choices: ["ごんべんの点", "売の横線", "ごんべんの横", "儿の左"], difficulty: 3 },

  // 難易度4（追加）
  { kanji: "医", strokeCount: 7, askStroke: 1, correctDirection: "横線（上）", choices: ["横線（上）", "縦折れ", "矢の左はらい", "点"], difficulty: 4 },
  { kanji: "区", strokeCount: 4, askStroke: 1, correctDirection: "横線（上）", choices: ["横線（上）", "メの左はらい", "縦折れ", "メの右はらい"], difficulty: 4 },
  { kanji: "武", strokeCount: 8, askStroke: 1, correctDirection: "横線（一）", choices: ["横線（一）", "縦線", "止の縦", "左はらい"], difficulty: 4 },
  { kanji: "再", strokeCount: 6, askStroke: 1, correctDirection: "横線（上）", choices: ["横線（上）", "縦線（左）", "縦線（中）", "横線（下）"], difficulty: 4 },
  { kanji: "興", strokeCount: 16, askStroke: 1, correctDirection: "左上の横線", choices: ["左上の横線", "縦線", "右上の横線", "同の縦"], difficulty: 4 },

  // 難易度5（追加）
  { kanji: "飲", strokeCount: 12, askStroke: 1, correctDirection: "食へんの左はらい", choices: ["食へんの左はらい", "食へんの横線", "欠の左はらい", "食へんの点"], difficulty: 5 },
  { kanji: "療", strokeCount: 17, askStroke: 1, correctDirection: "やまいだれの点（上左）", choices: ["やまいだれの点（上左）", "横線", "縦折れ", "りょうの横線"], difficulty: 5 },
];
