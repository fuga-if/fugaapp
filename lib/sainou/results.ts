import { SainouType } from './questions';

export interface SainouResult {
  type: SainouType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<SainouType, SainouResult> = {
  'type-a': {
    type: 'type-a',
    title: "言語の才能",
    subtitle: "言葉で世界を変える力",
    description: "あなたの隠れた才能は「言葉の力」。文章を書く、話す、人の心を動かす——言語に関する才能が眠っている。読書家だったり、LINEの文面にこだわったり、無意識に言葉を大切にしているはず。ライター、作家、スピーカーの素質あり。",
    traits: [
      "LINEやSNSの文章が長め",
      "読書が好き（or 好きだった）",
      "言い回しにこだわりがある",
      "人の話を正確に要約できる",
      "「文章うまいね」と言われたことがある",
    ],
    quote: "「言葉は、世界を変える最初の一歩」",
    emoji: "✍️",
    color: "#8B5CF6",
    image: "/images/sainou/type-a.png",
  },
  'type-b': {
    type: 'type-b',
    title: "分析の才能",
    subtitle: "見えないパターンを見抜く目",
    description: "あなたの隠れた才能は「分析力」。データや情報の中からパターンを見抜き、論理的に物事を整理できる。数字に強かったり、ゲームの攻略が得意だったり、「頭いいね」と言われることがあるはず。アナリスト、エンジニア、研究者の素質あり。",
    traits: [
      "数字やデータを見るのが好き",
      "ゲームの攻略情報をまとめたことがある",
      "「理屈っぽい」と言われる",
      "比較検討してから買い物する",
      "問題の原因を探るのが得意",
    ],
    quote: "「数字は嘘をつかない」",
    emoji: "📊",
    color: "#0EA5E9",
    image: "/images/sainou/type-b.png",
  },
  'type-c': {
    type: 'type-c',
    title: "共感の才能",
    subtitle: "人の心を読む、天性のカウンセラー",
    description: "あなたの隠れた才能は「共感力」。人の気持ちを感じ取り、寄り添うことができる。友達の悩み相談係だったり、空気を読むのが得意だったり。カウンセラー、看護師、教師の素質あり。",
    traits: [
      "人の表情の変化に気づく",
      "映画やドラマで泣きがち",
      "「聞き上手」と言われる",
      "困ってる人を見ると助けたくなる",
      "空気を読みすぎて疲れることも",
    ],
    quote: "「あなたの気持ち、ちゃんと届いてるよ」",
    emoji: "💝",
    color: "#EC4899",
    image: "/images/sainou/type-c.png",
  },
  'type-d': {
    type: 'type-d',
    title: "創造の才能",
    subtitle: "ゼロから何かを生み出す力",
    description: "あなたの隠れた才能は「創造力」。既存の枠にとらわれず、新しいアイデアや作品を生み出せる。落書きが好きだったり、空想にふけったり、「変わってるね」と言われるのは創造力の証。クリエイター、デザイナー、起業家の素質あり。",
    traits: [
      "空想や妄想が日常",
      "「それ面白い発想だね」と言われる",
      "DIYや手作りが好き",
      "既存のルールに違和感を覚える",
      "アイデアが突然降ってくる",
    ],
    quote: "「まだこの世にないものを、作りたい」",
    emoji: "🎨",
    color: "#F59E0B",
    image: "/images/sainou/type-d.png",
  },
  'type-e': {
    type: 'type-e',
    title: "観察の才能",
    subtitle: "誰も気づかない細部を見抜く眼",
    description: "あなたの隠れた才能は「観察力」。他の人が見落とす小さな変化や細部に気づける。間違い探しが得意だったり、人の髪型の変化に気づいたり。探偵、編集者、品質管理、研究者の素質あり。",
    traits: [
      "人の髪型や服装の変化に気づく",
      "間違い探しやパズルが得意",
      "細かいミスを見つけるのが得意",
      "風景の変化に敏感",
      "「よく気づくね」と言われる",
    ],
    quote: "「答えはいつも、細部に宿っている」",
    emoji: "🔍",
    color: "#059669",
    image: "/images/sainou/type-e.png",
  },
  'type-f': {
    type: 'type-f',
    title: "リーダーシップの才能",
    subtitle: "人を動かし、チームを導く力",
    description: "あなたの隠れた才能は「リーダーシップ」。自然と人が集まり、まとめ役を任されることが多い。決断力があり、ピンチのときこそ力を発揮する。経営者、プロジェクトマネージャー、政治家の素質あり。",
    traits: [
      "グループワークでリーダーになりがち",
      "決断が速い",
      "人に頼られることが多い",
      "「ついていきたい」と言われたことがある",
      "責任感が人一倍強い",
    ],
    quote: "「みんなの力を、最高の結果に変える」",
    emoji: "👑",
    color: "#DC2626",
    image: "/images/sainou/type-f.png",
  },
};

export function getResultByScores(scores: Record<SainouType, number>): SainouResult {
  let maxType: SainouType = 'type-a';
  let maxScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as SainouType;
    }
  }

  return results[maxType];
}
