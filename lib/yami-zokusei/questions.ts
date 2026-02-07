export type YamiType = 'shikkoku-yami' | 'souen-gouka' | 'itetsuku-hyouga' | 'shiden-raikou' | 'seinaru-hikari' | 'kyomu-kaze';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<YamiType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "ピンチの時、あなたの本能的な反応は？",
    options: [
      { label: "静かに状況を分析する", scores: { 'itetsuku-hyouga': 2, 'shikkoku-yami': 1 } },
      { label: "感情が爆発する", scores: { 'souen-gouka': 3 } },
      { label: "冷静に最速の解決策を探す", scores: { 'shiden-raikou': 3 } },
      { label: "仲間を守ることを最優先に", scores: { 'seinaru-hikari': 3 } },
      { label: "達観してる。なるようになる", scores: { 'kyomu-kaze': 3 } },
      { label: "闇の力が目覚める（嘘）", scores: { 'shikkoku-yami': 3 } },
    ],
  },
  {
    id: 2,
    text: "好きな時間帯は？",
    options: [
      { label: "深夜。静寂が心地いい", scores: { 'shikkoku-yami': 3 } },
      { label: "夕焼け。エモい", scores: { 'souen-gouka': 2, 'seinaru-hikari': 1 } },
      { label: "早朝。澄んだ空気", scores: { 'itetsuku-hyouga': 3 } },
      { label: "雷雨の時。テンション上がる", scores: { 'shiden-raikou': 3 } },
      { label: "晴れた昼。みんなが笑顔", scores: { 'seinaru-hikari': 3 } },
      { label: "曇り。どうでもいい天気が好き", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 3,
    text: "異世界転生したら何になりたい？",
    options: [
      { label: "闇魔法使い", scores: { 'shikkoku-yami': 3 } },
      { label: "炎の戦士", scores: { 'souen-gouka': 3 } },
      { label: "氷の賢者", scores: { 'itetsuku-hyouga': 3 } },
      { label: "雷の暗殺者", scores: { 'shiden-raikou': 3 } },
      { label: "聖騎士", scores: { 'seinaru-hikari': 3 } },
      { label: "旅人。どこの組織にも属さない", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 4,
    text: "チームでの役割は？",
    options: [
      { label: "影で全てを操る参謀", scores: { 'shikkoku-yami': 3 } },
      { label: "前線で突撃するアタッカー", scores: { 'souen-gouka': 3 } },
      { label: "冷静な司令塔", scores: { 'itetsuku-hyouga': 2, 'shiden-raikou': 1 } },
      { label: "速攻で問題を片付けるスピードスター", scores: { 'shiden-raikou': 3 } },
      { label: "みんなを癒すヒーラー", scores: { 'seinaru-hikari': 3 } },
      { label: "自由行動。必要な時だけ来る", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 5,
    text: "怒った時のスタイルは？",
    options: [
      { label: "無言。周りの空気が重くなる", scores: { 'shikkoku-yami': 3 } },
      { label: "感情爆発。すぐ顔に出る", scores: { 'souen-gouka': 3 } },
      { label: "氷のように冷たくなる", scores: { 'itetsuku-hyouga': 3 } },
      { label: "一瞬キレてすぐ忘れる", scores: { 'shiden-raikou': 3 } },
      { label: "怒らない。許す", scores: { 'seinaru-hikari': 3 } },
      { label: "そもそもあまり怒らない", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 6,
    text: "好きなファッションのテイストは？",
    options: [
      { label: "黒一色。ダークモード", scores: { 'shikkoku-yami': 3 } },
      { label: "赤やオレンジ、目立つ色", scores: { 'souen-gouka': 3 } },
      { label: "白やブルー、クールな色味", scores: { 'itetsuku-hyouga': 3 } },
      { label: "原色バキバキ、ストリート系", scores: { 'shiden-raikou': 3 } },
      { label: "パステル、清潔感", scores: { 'seinaru-hikari': 3 } },
      { label: "こだわりなし。着れればいい", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 7,
    text: "座右の銘に近いのは？",
    options: [
      { label: "「孤独こそ最強」", scores: { 'shikkoku-yami': 3 } },
      { label: "「情熱があれば何でもできる」", scores: { 'souen-gouka': 3 } },
      { label: "「感情に流されるな」", scores: { 'itetsuku-hyouga': 3 } },
      { label: "「迷ったら即行動」", scores: { 'shiden-raikou': 3 } },
      { label: "「人に優しく」", scores: { 'seinaru-hikari': 3 } },
      { label: "「なるようになる」", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 8,
    text: "戦闘BGMを選ぶなら？",
    options: [
      { label: "重厚なオーケストラ", scores: { 'shikkoku-yami': 2, 'seinaru-hikari': 1 } },
      { label: "激しいロック/メタル", scores: { 'souen-gouka': 3 } },
      { label: "美しいピアノ", scores: { 'itetsuku-hyouga': 3 } },
      { label: "アップテンポなEDM", scores: { 'shiden-raikou': 3 } },
      { label: "壮大な合唱曲", scores: { 'seinaru-hikari': 3 } },
      { label: "BGMいらない。無音がいい", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 9,
    text: "一番カッコいいと思うシチュエーションは？",
    options: [
      { label: "仲間のピンチに覚醒する闇の力", scores: { 'shikkoku-yami': 3 } },
      { label: "全力で立ち向かって逆転する", scores: { 'souen-gouka': 3 } },
      { label: "一言で全てを切り捨てる", scores: { 'itetsuku-hyouga': 3 } },
      { label: "一瞬で決着をつける", scores: { 'shiden-raikou': 3 } },
      { label: "身を挺して誰かを守る", scores: { 'seinaru-hikari': 3 } },
      { label: "全てが終わった後に颯爽と去る", scores: { 'kyomu-kaze': 3 } },
    ],
  },
  {
    id: 10,
    text: "あなたの\"厨二病レベル\"は？",
    options: [
      { label: "今でも心の中に闇を飼ってる", scores: { 'shikkoku-yami': 3 } },
      { label: "熱い展開が好き。胸が熱くなる", scores: { 'souen-gouka': 3 } },
      { label: "クール系主人公に感情移入する", scores: { 'itetsuku-hyouga': 3 } },
      { label: "最速・最強キャラが好き", scores: { 'shiden-raikou': 3 } },
      { label: "正義の味方に憧れてた", scores: { 'seinaru-hikari': 3 } },
      { label: "厨二病？何それおいしいの", scores: { 'kyomu-kaze': 3 } },
    ],
  },
];
