export interface YojijukugoRank {
  rank: string;
  title: string;
  threshold: number; // 正解数以上でこのランク
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: YojijukugoRank[] = [
  { rank: "S", title: "四字熟語博士", threshold: 18, description: "圧倒的な語彙力！国語の先生になれる", emoji: "📚", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "言葉の達人", threshold: 14, description: "素晴らしい！難しい熟語もスラスラ", emoji: "🎓", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "読書家", threshold: 10, description: "平均以上の語彙力。本をよく読む？", emoji: "📖", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "一般教養レベル", threshold: 7, description: "平均的な知識。基本は押さえてる", emoji: "✏️", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "なんとなく派", threshold: 4, description: "聞いたことはあるけど…", emoji: "🤔", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "四字熟語？", threshold: 0, description: "漢字4つ並んでると眠くなる", emoji: "😪", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): YojijukugoRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}

// 四字熟語問題データ
export interface YojijukugoQuestion {
  full: string; // 完全な四字熟語
  display: string; // 表示形式（○で穴埋め）
  blank: string; // 空欄の漢字
  choices: string[]; // 4択
  meaning: string; // 意味
  difficulty: number; // 1-5
}

export const yojijukugoQuestions: YojijukugoQuestion[] = [
  // 難易度1（基本）
  { full: "一石二鳥", display: "一石○鳥", blank: "二", choices: ["二", "三", "四", "五"], meaning: "一つの行為で二つの利益を得る", difficulty: 1 },
  { full: "四面楚歌", display: "四面○歌", blank: "楚", choices: ["楚", "秦", "漢", "唐"], meaning: "周りが敵ばかりで孤立する", difficulty: 1 },
  { full: "一期一会", display: "一期一○", blank: "会", choices: ["会", "回", "界", "開"], meaning: "一生に一度の出会いを大切に", difficulty: 1 },
  { full: "十人十色", display: "十人十○", blank: "色", choices: ["色", "食", "職", "式"], meaning: "人それぞれ好みが違う", difficulty: 1 },
  { full: "以心伝心", display: "以○伝心", blank: "心", choices: ["心", "身", "信", "神"], meaning: "言葉なしで気持ちが通じ合う", difficulty: 1 },
  { full: "自業自得", display: "自業○得", blank: "自", choices: ["自", "地", "時", "次"], meaning: "自分の行いの報いを自分で受ける", difficulty: 1 },
  { full: "弱肉強食", display: "弱肉○食", blank: "強", choices: ["強", "狂", "京", "競"], meaning: "弱者が強者に食われる", difficulty: 1 },
  { full: "起死回生", display: "起死○生", blank: "回", choices: ["回", "会", "快", "改"], meaning: "絶望的な状態から立ち直る", difficulty: 1 },
  
  // 難易度2（中級）
  { full: "切磋琢磨", display: "切磋○磨", blank: "琢", choices: ["琢", "拓", "卓", "宅"], meaning: "互いに励まし合い向上する", difficulty: 2 },
  { full: "臨機応変", display: "臨機○変", blank: "応", choices: ["応", "王", "央", "欧"], meaning: "状況に応じて対応を変える", difficulty: 2 },
  { full: "質実剛健", display: "質実○健", blank: "剛", choices: ["剛", "鋼", "強", "豪"], meaning: "飾り気なく丈夫でたくましい", difficulty: 2 },
  { full: "温故知新", display: "温故○新", blank: "知", choices: ["知", "地", "智", "池"], meaning: "古いことを学び新しい知識を得る", difficulty: 2 },
  { full: "千載一遇", display: "千載○遇", blank: "一", choices: ["一", "壱", "逸", "溢"], meaning: "千年に一度しかない好機", difficulty: 2 },
  { full: "疑心暗鬼", display: "疑心○鬼", blank: "暗", choices: ["暗", "闇", "案", "安"], meaning: "疑い始めると何でも怪しく見える", difficulty: 2 },
  { full: "試行錯誤", display: "試行○誤", blank: "錯", choices: ["錯", "作", "策", "索"], meaning: "失敗を繰り返しながら解決を探る", difficulty: 2 },
  { full: "粉骨砕身", display: "粉骨○身", blank: "砕", choices: ["砕", "最", "催", "采"], meaning: "力の限り努力する", difficulty: 2 },
  
  // 難易度3（上級）
  { full: "画竜点睛", display: "画竜○睛", blank: "点", choices: ["点", "天", "典", "殿"], meaning: "仕上げの大切な部分", difficulty: 3 },
  { full: "呉越同舟", display: "呉越○舟", blank: "同", choices: ["同", "銅", "童", "胴"], meaning: "敵同士が同じ場所に居合わせる", difficulty: 3 },
  { full: "朝令暮改", display: "朝令○改", blank: "暮", choices: ["暮", "墓", "募", "慕"], meaning: "命令や方針がすぐ変わる", difficulty: 3 },
  { full: "竜頭蛇尾", display: "竜頭○尾", blank: "蛇", choices: ["蛇", "邪", "者", "謝"], meaning: "始めは勢いがあるが終わりは振るわない", difficulty: 3 },
  { full: "明鏡止水", display: "明鏡○水", blank: "止", choices: ["止", "死", "始", "旨"], meaning: "邪念のない澄み切った心", difficulty: 3 },
  { full: "天衣無縫", display: "天衣○縫", blank: "無", choices: ["無", "夢", "舞", "霧"], meaning: "自然で飾り気がない", difficulty: 3 },
  { full: "傍若無人", display: "傍若○人", blank: "無", choices: ["無", "夢", "武", "舞"], meaning: "人目を気にせず勝手に振る舞う", difficulty: 3 },
  { full: "大器晩成", display: "大器○成", blank: "晩", choices: ["晩", "万", "満", "蛮"], meaning: "大人物は遅れて頭角を現す", difficulty: 3 },
  
  // 難易度4（難問）
  { full: "羊頭狗肉", display: "羊頭○肉", blank: "狗", choices: ["狗", "犬", "苟", "句"], meaning: "見せかけと実質が違う", difficulty: 4 },
  { full: "朝三暮四", display: "朝○暮四", blank: "三", choices: ["三", "参", "惨", "山"], meaning: "目先の違いにこだわり本質を見失う", difficulty: 4 },
  { full: "魑魅魍魎", display: "魑魅○魎", blank: "魍", choices: ["魍", "網", "望", "妄"], meaning: "様々な化け物、悪人たち", difficulty: 4 },
  { full: "換骨奪胎", display: "換骨○胎", blank: "奪", choices: ["奪", "脱", "達", "妥"], meaning: "古いものを作り変えて新しくする", difficulty: 4 },
  { full: "牽強付会", display: "牽強○会", blank: "付", choices: ["付", "附", "符", "腐"], meaning: "無理にこじつける", difficulty: 4 },
  { full: "眉目秀麗", display: "眉目○麗", blank: "秀", choices: ["秀", "修", "収", "周"], meaning: "顔立ちが整って美しい", difficulty: 4 },
  
  // 難易度5（超難問）
  { full: "獅子奮迅", display: "獅子○迅", blank: "奮", choices: ["奮", "噴", "憤", "墳"], meaning: "猛烈な勢いで活躍する", difficulty: 5 },
  { full: "蹉跎歳月", display: "蹉跎○月", blank: "歳", choices: ["歳", "才", "際", "采"], meaning: "無駄に時を過ごす", difficulty: 5 },
  { full: "泰然自若", display: "泰然○若", blank: "自", choices: ["自", "時", "次", "児"], meaning: "落ち着いて動じない", difficulty: 5 },
  { full: "慇懃無礼", display: "慇懃○礼", blank: "無", choices: ["無", "夢", "武", "舞"], meaning: "丁寧すぎて却って失礼", difficulty: 5 },
];
