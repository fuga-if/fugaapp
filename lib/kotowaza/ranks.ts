export interface KotowazaRank {
  rank: string;
  title: string;
  threshold: number;
  description: string;
  emoji: string;
  color: string;
  percentile: number;
}

const ranks: KotowazaRank[] = [
  { rank: "S", title: "ことわざ博士", threshold: 18, description: "完璧！日本語マスター", emoji: "📜", color: "#FFD700", percentile: 3 },
  { rank: "A", title: "言葉の達人", threshold: 14, description: "素晴らしい語彙力！", emoji: "🎓", color: "#FF6B35", percentile: 10 },
  { rank: "B", title: "読書家", threshold: 10, description: "平均以上！よく知ってる", emoji: "📖", color: "#4ECDC4", percentile: 25 },
  { rank: "C", title: "一般教養", threshold: 7, description: "基本は押さえてる", emoji: "✏️", color: "#45B7D1", percentile: 50 },
  { rank: "D", title: "なんとなく派", threshold: 4, description: "聞いたことはある…", emoji: "🤔", color: "#96CEB4", percentile: 75 },
  { rank: "E", title: "ことわざ？", threshold: 0, description: "もっと本を読もう！", emoji: "😪", color: "#A8A8A8", percentile: 95 },
];

export function getRank(correct: number): KotowazaRank {
  return ranks.find((r) => correct >= r.threshold) || ranks[ranks.length - 1];
}

export interface KotowazaQuestion {
  full: string;
  display: string;
  blank: string;
  choices: string[];
  meaning: string;
  difficulty: number;
}

export const kotowazaQuestions: KotowazaQuestion[] = [
  // 難易度1
  { full: "猿も木から落ちる", display: "○も木から落ちる", blank: "猿", choices: ["猿", "熊", "鳥", "虫"], meaning: "名人でも失敗することがある", difficulty: 1 },
  { full: "犬も歩けば棒に当たる", display: "犬も歩けば○に当たる", blank: "棒", choices: ["棒", "石", "壁", "人"], meaning: "何かしていれば思わぬ幸運に出会う", difficulty: 1 },
  { full: "花より団子", display: "花より○", blank: "団子", choices: ["団子", "餅", "饅頭", "煎餅"], meaning: "風流より実益を取る", difficulty: 1 },
  { full: "石の上にも三年", display: "石の上にも○年", blank: "三", choices: ["三", "五", "七", "十"], meaning: "辛抱すれば報われる", difficulty: 1 },
  { full: "七転び八起き", display: "七転び○起き", blank: "八", choices: ["八", "九", "十", "七"], meaning: "何度失敗しても諦めない", difficulty: 1 },
  { full: "急がば回れ", display: "急がば○", blank: "回れ", choices: ["回れ", "走れ", "止まれ", "待て"], meaning: "急ぐときこそ確実な方法を", difficulty: 1 },
  { full: "百聞は一見にしかず", display: "百聞は○にしかず", blank: "一見", choices: ["一見", "一言", "一度", "一回"], meaning: "聞くより見た方が確実", difficulty: 1 },
  { full: "塵も積もれば山となる", display: "○も積もれば山となる", blank: "塵", choices: ["塵", "砂", "土", "雪"], meaning: "小さなことも積み重ねれば大きくなる", difficulty: 1 },

  // 難易度2
  { full: "能ある鷹は爪を隠す", display: "能ある○は爪を隠す", blank: "鷹", choices: ["鷹", "鳥", "猫", "狐"], meaning: "実力者は普段それを見せびらかさない", difficulty: 2 },
  { full: "井の中の蛙大海を知らず", display: "井の中の○大海を知らず", blank: "蛙", choices: ["蛙", "魚", "亀", "蟹"], meaning: "狭い世界で満足して広い世界を知らない", difficulty: 2 },
  { full: "転ばぬ先の杖", display: "転ばぬ先の○", blank: "杖", choices: ["杖", "手", "足", "石"], meaning: "事前の準備が大切", difficulty: 2 },
  { full: "棚からぼたもち", display: "棚から○", blank: "ぼたもち", choices: ["ぼたもち", "おはぎ", "だんご", "まんじゅう"], meaning: "思いがけない幸運", difficulty: 2 },
  { full: "三人寄れば文殊の知恵", display: "三人寄れば○の知恵", blank: "文殊", choices: ["文殊", "観音", "阿弥陀", "地蔵"], meaning: "凡人でも集まれば良い考えが出る", difficulty: 2 },
  { full: "馬の耳に念仏", display: "馬の耳に○", blank: "念仏", choices: ["念仏", "経文", "説法", "読経"], meaning: "いくら言っても効果がない", difficulty: 2 },
  { full: "雀百まで踊り忘れず", display: "○百まで踊り忘れず", blank: "雀", choices: ["雀", "鳩", "烏", "鶴"], meaning: "幼い頃の習慣は年を取っても変わらない", difficulty: 2 },
  { full: "豚に真珠", display: "○に真珠", blank: "豚", choices: ["豚", "犬", "猫", "馬"], meaning: "価値のわからない者に高価なものを与えても無駄", difficulty: 2 },

  // 難易度3
  { full: "虎穴に入らずんば虎子を得ず", display: "虎穴に入らずんば○を得ず", blank: "虎子", choices: ["虎子", "虎皮", "虎牙", "虎骨"], meaning: "危険を冒さなければ成功は得られない", difficulty: 3 },
  { full: "覆水盆に返らず", display: "覆水○に返らず", blank: "盆", choices: ["盆", "皿", "椀", "杯"], meaning: "一度起きたことは取り返しがつかない", difficulty: 3 },
  { full: "灯台下暗し", display: "○下暗し", blank: "灯台", choices: ["灯台", "提灯", "蝋燭", "松明"], meaning: "身近なことほど気づきにくい", difficulty: 3 },
  { full: "蛙の子は蛙", display: "蛙の子は○", blank: "蛙", choices: ["蛙", "蝌蚪", "魚", "亀"], meaning: "子は親に似る", difficulty: 3 },
  { full: "木を見て森を見ず", display: "○を見て森を見ず", blank: "木", choices: ["木", "葉", "枝", "花"], meaning: "細部にとらわれて全体を見失う", difficulty: 3 },
  { full: "弘法も筆の誤り", display: "○も筆の誤り", blank: "弘法", choices: ["弘法", "空海", "聖徳", "天皇"], meaning: "名人でも失敗はある", difficulty: 3 },
  { full: "河童の川流れ", display: "○の川流れ", blank: "河童", choices: ["河童", "魚", "亀", "蛙"], meaning: "得意なことでも油断すると失敗する", difficulty: 3 },
  { full: "瓢箪から駒", display: "○から駒", blank: "瓢箪", choices: ["瓢箪", "壺", "瓶", "箱"], meaning: "思いがけないことが起こる", difficulty: 3 },

  // 難易度4
  { full: "李下に冠を正さず", display: "李下に○を正さず", blank: "冠", choices: ["冠", "帽", "笠", "髪"], meaning: "疑われるような行動は避けるべき", difficulty: 4 },
  { full: "青は藍より出でて藍より青し", display: "青は○より出でて藍より青し", blank: "藍", choices: ["藍", "紺", "紫", "青"], meaning: "弟子が師匠を超える", difficulty: 4 },
  { full: "糠に釘", display: "○に釘", blank: "糠", choices: ["糠", "砂", "泥", "藁"], meaning: "手応えがない、効果がない", difficulty: 4 },
  { full: "暖簾に腕押し", display: "○に腕押し", blank: "暖簾", choices: ["暖簾", "襖", "障子", "幕"], meaning: "手応えがない", difficulty: 4 },
  { full: "蓼食う虫も好き好き", display: "○食う虫も好き好き", blank: "蓼", choices: ["蓼", "草", "葉", "苔"], meaning: "人の好みは様々", difficulty: 4 },
  { full: "鶴の一声", display: "○の一声", blank: "鶴", choices: ["鶴", "鷹", "鳳", "雁"], meaning: "権力者の一言で決まる", difficulty: 4 },

  // 難易度5
  { full: "濡れ手で粟", display: "濡れ手で○", blank: "粟", choices: ["粟", "米", "麦", "豆"], meaning: "苦労せずに利益を得る", difficulty: 5 },
  { full: "鬼の居ぬ間に洗濯", display: "鬼の居ぬ間に○", blank: "洗濯", choices: ["洗濯", "掃除", "昼寝", "遊戯"], meaning: "怖い人がいない間に息抜きする", difficulty: 5 },
  { full: "柳に風", display: "○に風", blank: "柳", choices: ["柳", "竹", "松", "桜"], meaning: "逆らわず受け流す", difficulty: 5 },
  { full: "船頭多くして船山に上る", display: "船頭多くして船○に上る", blank: "山", choices: ["山", "丘", "岸", "陸"], meaning: "指図する人が多いと物事がうまくいかない", difficulty: 5 },
];
