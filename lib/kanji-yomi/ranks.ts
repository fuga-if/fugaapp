export interface KanjiYomiRank {
  rank: string;
  title: string;
  threshold: number; // 正解数以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: KanjiYomiRank[] = [
  { rank: "S", title: "漢字博士", threshold: 18, description: "圧倒的な漢字力！辞書いらず", emoji: "📚", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "読書家", threshold: 14, description: "素晴らしい漢字力！難読漢字もスラスラ", emoji: "📖", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "漢字好き", threshold: 10, description: "平均以上の漢字力。読書してる？", emoji: "✏️", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "一般教養レベル", threshold: 7, description: "平均的な漢字力。日常には困らない", emoji: "🌱", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "スマホ変換頼り", threshold: 4, description: "読めない漢字多め…予測変換に感謝", emoji: "📱", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "ひらがな派", threshold: 0, description: "漢字よりひらがなが好き！", emoji: "あ", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): KanjiYomiRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}

// 漢字問題データ（易→難の順）
export interface KanjiQuestion {
  kanji: string;
  correct: string;
  choices: string[];
  difficulty: number; // 1-5
}

export const kanjiQuestions: KanjiQuestion[] = [
  // 難易度1（小学校レベル）
  { kanji: "大人", correct: "おとな", choices: ["おとな", "たいじん", "だいにん", "おおひと"], difficulty: 1 },
  { kanji: "昨日", correct: "きのう", choices: ["きのう", "さくじつ", "さくにち", "きのひ"], difficulty: 1 },
  { kanji: "今日", correct: "きょう", choices: ["きょう", "こんにち", "こんじつ", "いまひ"], difficulty: 1 },
  { kanji: "明日", correct: "あした", choices: ["あした", "めいにち", "みょうにち", "あくび"], difficulty: 1 },
  { kanji: "上手", correct: "じょうず", choices: ["じょうず", "うわて", "かみて", "うえで"], difficulty: 1 },

  // 難易度2（中学レベル）
  { kanji: "相応しい", correct: "ふさわしい", choices: ["ふさわしい", "あいおうしい", "そうおうしい", "こたえしい"], difficulty: 2 },
  { kanji: "流石", correct: "さすが", choices: ["さすが", "りゅうせき", "ながいし", "るいせき"], difficulty: 2 },
  { kanji: "素人", correct: "しろうと", choices: ["しろうと", "そじん", "すびと", "もとひと"], difficulty: 2 },
  { kanji: "雰囲気", correct: "ふんいき", choices: ["ふんいき", "ふいんき", "ふういき", "くういき"], difficulty: 2 },
  { kanji: "十八番", correct: "おはこ", choices: ["おはこ", "じゅうはちばん", "とはちばん", "じっぱち"], difficulty: 2 },

  // 難易度3（高校レベル）
  { kanji: "漸く", correct: "ようやく", choices: ["ようやく", "しばらく", "すべからく", "おもむく"], difficulty: 3 },
  { kanji: "暫く", correct: "しばらく", choices: ["しばらく", "ようやく", "おもむく", "ことごとく"], difficulty: 3 },
  { kanji: "所謂", correct: "いわゆる", choices: ["いわゆる", "しょせん", "ところが", "しょい"], difficulty: 3 },
  { kanji: "老舗", correct: "しにせ", choices: ["しにせ", "ろうほ", "おいみせ", "ふるみせ"], difficulty: 3 },
  { kanji: "出鱈目", correct: "でたらめ", choices: ["でたらめ", "しゅつらもく", "でだらめ", "しゅったらめ"], difficulty: 3 },

  // 難易度4（難読）
  { kanji: "海豚", correct: "いるか", choices: ["いるか", "かいとん", "うみぶた", "あしか"], difficulty: 4 },
  { kanji: "案山子", correct: "かかし", choices: ["かかし", "あんざんし", "あんざんこ", "やまこ"], difficulty: 4 },
  { kanji: "土竜", correct: "もぐら", choices: ["もぐら", "どりゅう", "つちりゅう", "みずち"], difficulty: 4 },
  { kanji: "百舌鳥", correct: "もず", choices: ["もず", "ひゃくぜつちょう", "ももどり", "むくどり"], difficulty: 4 },
  { kanji: "五月雨", correct: "さみだれ", choices: ["さみだれ", "ごがつあめ", "さつきあめ", "ごげつう"], difficulty: 4 },

  // 難易度5（超難読）
  { kanji: "躑躅", correct: "つつじ", choices: ["つつじ", "てきちょく", "ちょくちょく", "どくだみ"], difficulty: 5 },
  { kanji: "蒲公英", correct: "たんぽぽ", choices: ["たんぽぽ", "ほこうえい", "がまえい", "れんげ"], difficulty: 5 },
  { kanji: "海星", correct: "ひとで", choices: ["ひとで", "かいせい", "うみぼし", "くらげ"], difficulty: 5 },
  { kanji: "啄木鳥", correct: "きつつき", choices: ["きつつき", "たくぼくちょう", "つぐみ", "ほととぎす"], difficulty: 5 },
  { kanji: "鸚鵡", correct: "おうむ", choices: ["おうむ", "いんこ", "おうぎ", "ほうおう"], difficulty: 5 },

  // 難易度1（追加）
  { kanji: "一人", correct: "ひとり", choices: ["ひとり", "いちにん", "いちじん", "かずと"], difficulty: 1 },
  { kanji: "下手", correct: "へた", choices: ["へた", "したて", "したで", "げしゅ"], difficulty: 1 },
  { kanji: "七夕", correct: "たなばた", choices: ["たなばた", "しちせき", "ななゆう", "しちゆう"], difficulty: 1 },
  { kanji: "一日", correct: "ついたち", choices: ["ついたち", "いちにち", "いちじつ", "ひとひ"], difficulty: 1 },
  { kanji: "二十歳", correct: "はたち", choices: ["はたち", "にじゅっさい", "にじっさい", "ふたとせ"], difficulty: 1 },

  // 難易度2（追加）
  { kanji: "玄人", correct: "くろうと", choices: ["くろうと", "げんじん", "くろひと", "げんにん"], difficulty: 2 },
  { kanji: "時雨", correct: "しぐれ", choices: ["しぐれ", "じう", "ときあめ", "ときさめ"], difficulty: 2 },
  { kanji: "紅葉", correct: "もみじ", choices: ["もみじ", "こうよう", "べにば", "くれは"], difficulty: 2 },
  { kanji: "女将", correct: "おかみ", choices: ["おかみ", "じょしょう", "おんなしょう", "めしょう"], difficulty: 2 },
  { kanji: "風邪", correct: "かぜ", choices: ["かぜ", "ふうじゃ", "かざ", "ふうや"], difficulty: 2 },
  { kanji: "眼鏡", correct: "めがね", choices: ["めがね", "がんきょう", "まなこかがみ", "がんけい"], difficulty: 2 },
  { kanji: "梅雨", correct: "つゆ", choices: ["つゆ", "ばいう", "うめあめ", "ばいさめ"], difficulty: 2 },
  { kanji: "若人", correct: "わこうど", choices: ["わこうど", "わかびと", "じゃくじん", "わかもの"], difficulty: 2 },

  // 難易度3（追加）
  { kanji: "強か", correct: "したたか", choices: ["したたか", "つよか", "きょうか", "ごうか"], difficulty: 3 },
  { kanji: "健か", correct: "すこやか", choices: ["すこやか", "けんか", "たけか", "つよか"], difficulty: 3 },
  { kanji: "殆ど", correct: "ほとんど", choices: ["ほとんど", "たいど", "がいど", "きわど"], difficulty: 3 },
  { kanji: "態々", correct: "わざわざ", choices: ["わざわざ", "たいたい", "ざまざま", "つくづく"], difficulty: 3 },
  { kanji: "兎に角", correct: "とにかく", choices: ["とにかく", "うさにかど", "うにかく", "とにつの"], difficulty: 3 },
  { kanji: "一寸", correct: "ちょっと", choices: ["ちょっと", "いっすん", "ひとよせ", "いちすん"], difficulty: 3 },
  { kanji: "可笑しい", correct: "おかしい", choices: ["おかしい", "かしょうしい", "かわらしい", "こっけいしい"], difficulty: 3 },
  { kanji: "欠伸", correct: "あくび", choices: ["あくび", "けっしん", "かけのび", "けつしん"], difficulty: 3 },

  // 難易度4（追加）
  { kanji: "河豚", correct: "ふぐ", choices: ["ふぐ", "かわぶた", "かとん", "すっぽん"], difficulty: 4 },
  { kanji: "胡瓜", correct: "きゅうり", choices: ["きゅうり", "こうり", "うり", "へちま"], difficulty: 4 },
  { kanji: "南瓜", correct: "かぼちゃ", choices: ["かぼちゃ", "なんか", "へちま", "すいか"], difficulty: 4 },
  { kanji: "心太", correct: "ところてん", choices: ["ところてん", "しんた", "こころぶと", "しんだい"], difficulty: 4 },
  { kanji: "海月", correct: "くらげ", choices: ["くらげ", "かいげつ", "うみづき", "かいつき"], difficulty: 4 },
  { kanji: "蝸牛", correct: "かたつむり", choices: ["かたつむり", "かぎゅう", "でんでん", "なめくじ"], difficulty: 4 },
  { kanji: "山車", correct: "だし", choices: ["だし", "さんしゃ", "やまぐるま", "やまくるま"], difficulty: 4 },
  { kanji: "独楽", correct: "こま", choices: ["こま", "どくらく", "ひとりたの", "どくがく"], difficulty: 4 },

  // 難易度5（追加）
  { kanji: "翡翠", correct: "ひすい", choices: ["ひすい", "かわせみ", "ひすい", "えめらるど"], difficulty: 5 },
  { kanji: "不如帰", correct: "ほととぎす", choices: ["ほととぎす", "ふじょき", "ふにょき", "かっこう"], difficulty: 5 },
  { kanji: "玉蜀黍", correct: "とうもろこし", choices: ["とうもろこし", "たましょくきび", "ぎょくしょくしょ", "もろこし"], difficulty: 5 },
  { kanji: "向日葵", correct: "ひまわり", choices: ["ひまわり", "こうじつき", "むかひあおい", "こうにちき"], difficulty: 5 },
  { kanji: "無花果", correct: "いちじく", choices: ["いちじく", "むかか", "むはなか", "ぶどう"], difficulty: 5 },
  { kanji: "案山子", correct: "かかし", choices: ["かかし", "あんざんし", "あんざんこ", "やまこ"], difficulty: 5 },
];
