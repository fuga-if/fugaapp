import { GengokaType } from './questions';

export interface GengokaResult {
  type: GengokaType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  advice: string;
  shareText: string;
  emoji: string;
  color: string;
}

export const results: Record<GengokaType, GengokaResult> = {
  'type-a': {
    type: 'type-a',
    title: "詩人タイプ",
    subtitle: "感情を言葉に変える天才",
    description: "あなたは感情を言葉にするのが得意なタイプ。心が動いた瞬間を鮮やかに表現でき、比喩表現が自然に口から出てくる。SNSの投稿は「刺さる」と言われがちで、人の心を動かす言葉の魔術師。",
    traits: [
      "感動したことを伝えるのが上手い",
      "比喩表現が自然に出てくる",
      "SNSの投稿が共感を呼びやすい",
      "気持ちを込めた言葉に力がある",
      "熱量が言葉に乗る",
    ],
    advice: "論理的な整理が加われば最強。感情＋構造で、誰にでも伝わる表現力に！",
    shareText: "言語化力診断の結果、私は【詩人タイプ】でした✨ 感情を言葉にするのが得意らしい。確かにSNSの投稿には自信ある",
    emoji: "✨",
    color: "#EC4899",
  },
  'type-b': {
    type: 'type-b',
    title: "論理構築タイプ",
    subtitle: "筋道を立てる言葉の建築家",
    description: "あなたは順序立てて説明するのが得意なタイプ。「つまり」「なぜなら」が自然に出てくる、言葉の建築家。プレゼンや企画書で力を発揮し、複雑な話もわかりやすく構造化できる。",
    traits: [
      "結論→理由の順で話せる",
      "「つまり」「なぜなら」が口癖",
      "プレゼンが得意",
      "話に筋が通っていると言われる",
      "感情より事実ベースで伝える",
    ],
    advice: "感情のスパイスを足すと完璧。データ＋ストーリーで、心も動かせる伝え手に！",
    shareText: "言語化力診断の結果、私は【論理構築タイプ】でした📊 順序立てて説明するのが得意らしい。プレゼン任せてください",
    emoji: "📊",
    color: "#3B82F6",
  },
  'type-c': {
    type: 'type-c',
    title: "例え話マスタータイプ",
    subtitle: "難しいを簡単にする翻訳者",
    description: "あなたは難しいことを簡単に説明できるタイプ。「〜みたいなもの」という例え話で、誰でもわかる表現に変換できる天才。教える仕事や説明役に最適で、複雑な概念もスルスル伝わる。",
    traits: [
      "「〇〇みたいなもの」が得意",
      "難しい話を簡単にできる",
      "教えるのが上手いと言われる",
      "相手のレベルに合わせて話せる",
      "抽象と具体を行き来できる",
    ],
    advice: "例えの精度をさらに上げよう。相手の経験に合わせた例えを選べば、伝達力は無敵！",
    shareText: "言語化力診断の結果、私は【例え話マスター】でした🎯 難しいことを簡単に説明できるらしい。先生向いてる？",
    emoji: "🎯",
    color: "#F59E0B",
  },
  'type-d': {
    type: 'type-d',
    title: "聞き上手翻訳タイプ",
    subtitle: "相手の言葉を磨く通訳者",
    description: "あなたは相手の言葉を言い換えるのが得意なタイプ。「つまりこういうこと？」の確認が的確で、相手自身も気づいていなかった本音を引き出せる。ファシリテーターや相談役として重宝される存在。",
    traits: [
      "「つまりこういうこと？」が的確",
      "相手の本音を引き出せる",
      "聞き上手と言われる",
      "会議のまとめ役になりがち",
      "相手目線で言葉を選べる",
    ],
    advice: "自分の意見も積極的に発信しよう。聞く力＋発信力で、最高のコミュニケーターに！",
    shareText: "言語化力診断の結果、私は【聞き上手翻訳タイプ】でした👂 相手の言葉を言い換えるのが得意らしい。通訳的な？",
    emoji: "👂",
    color: "#10B981",
  },
  'type-e': {
    type: 'type-e',
    title: "言葉にならない直感タイプ",
    subtitle: "感覚で理解する行動の人",
    description: "あなたは感覚で物事を理解するタイプ。言葉にするより行動で示す職人気質。「なんとなくわかる」が多く、直感が鋭い。言語化は苦手に見えるけど、実はセンスの塊。必要な場面では的確な一言が出る。",
    traits: [
      "「なんとなく」で正解がわかる",
      "言葉より行動で示す",
      "直感が鋭いと言われる",
      "長い説明が苦手",
      "ここぞという時の一言は鋭い",
    ],
    advice: "感覚を言葉にする練習をしてみよう。「なんとなく」の裏にある理由を言語化できれば、周りの信頼がさらにアップ！",
    shareText: "言語化力診断の結果、私は【言葉にならない直感タイプ】でした🔮 言葉より行動で示すタイプらしい。職人気質",
    emoji: "🔮",
    color: "#8B5CF6",
  },
  'type-f': {
    type: 'type-f',
    title: "沈黙の賢者タイプ",
    subtitle: "頭の中は饒舌、口は寡黙",
    description: "あなたは言葉を選びすぎて黙るタイプ。でも頭の中には完璧な文章がある。文章にすると饒舌で、書く方が得意。慎重に言葉を選ぶからこそ、発する言葉には重みと深みがある。",
    traits: [
      "頭の中では完璧な文章がある",
      "文章にすると饒舌になる",
      "言葉を選びすぎて黙ることがある",
      "チャットやメールの方が得意",
      "発する言葉に重みがある",
    ],
    advice: "完璧じゃなくていいから声に出してみよう。60%の完成度でもあなたの言葉には深みがある。それだけで十分伝わる！",
    shareText: "言語化力診断の結果、私は【沈黙の賢者タイプ】でした🤫 頭の中では完璧な文章があるのに…わかる",
    emoji: "🤫",
    color: "#6366F1",
  },
};

export function getResultByScores(scores: Record<GengokaType, number>): GengokaResult {
  let maxType: GengokaType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as GengokaType;
    }
  }

  return results[maxType];
}
