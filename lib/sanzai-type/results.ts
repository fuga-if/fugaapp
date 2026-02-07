import { SanzaiType } from './questions';

export interface Result {
  type: SanzaiType;
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
  quote: string;
  emoji: string;
  color: string;
  image: string;
}

export const results: Record<SanzaiType, Result> = {
  goods: {
    type: 'goods',
    title: "グッズ積み職人",
    subtitle: "推しのグッズは全回収が基本",
    description: "アクスタ、缶バッジ、ぬいぐるみ…部屋が倉庫と化しているあなた！推しのグッズは全回収が基本。「飾る場所がない」は言い訳にならない、買ってから考えるスタイル。",
    traits: [
      "新商品は予約開始と同時にポチる",
      "ランダム商品は箱買いが安心",
      "部屋の収納は常にパンパン",
      "ダブりグッズの交換ネットワークを持ってる",
      "「これはまだ持ってない」が購入の合言葉",
    ],
    quote: "「推しのグッズは全回収が基本」",
    emoji: "🛍️",
    color: "#FFD700",
    image: "/images/sanzai-type/type-a.png",
  },
  ensei: {
    type: 'ensei',
    title: "遠征マイラー",
    subtitle: "遠征費は必要経費",
    description: "ライブ・イベントに全国飛び回るあなた！交通費と宿泊費がエグいけど、現地参戦の体験はプライスレス。マイルだけはめっちゃ貯まってる。",
    traits: [
      "新幹線の時刻表が頭に入ってる",
      "全国のホテルの相場に詳しい",
      "「遠征は人生の投資」が口癖",
      "スーツケースの荷造りが異様に早い",
      "マイルと宿泊ポイントだけは潤沢",
    ],
    quote: "「遠征費は必要経費」",
    emoji: "✈️",
    color: "#9C27B0",
    image: "/images/sanzai-type/type-b.png",
  },
  gacha: {
    type: 'gacha',
    title: "ガチャ錬金術師",
    subtitle: "あと1回だけ…が止まらない",
    description: "ソシャゲのガチャに溶かすあなた！天井は友達、石は通貨。お金を電子データに変える錬金術師。課金額を計算したら震えるけど、引けた時の快感には代えられない。",
    traits: [
      "「あと1回だけ」が10回続く",
      "天井到達回数に変な自信がある",
      "課金履歴は見ないようにしてる",
      "ガチャ報告をSNSに上げずにいられない",
      "爆死は日常、引けたら奇跡",
    ],
    quote: "「あと1回だけ…が止まらない」",
    emoji: "🎰",
    color: "#FF6F00",
    image: "/images/sanzai-type/type-c.png",
  },
  doujin: {
    type: 'doujin',
    title: "同人沼の住人",
    subtitle: "新刊チェックは人生の一部",
    description: "即売会で両手いっぱい、委託通販も漁るあなた！新刊チェックは人生の一部。本棚がもう1つ必要だけど、この世界の深さを知ってしまったらもう戻れない。",
    traits: [
      "コミケは戦場、サークルチェックは入念に",
      "委託通販の巡回が日課",
      "推しカプの新刊は即買い",
      "本棚が2つ以上ある",
      "「この作家さんの新刊は外せない」が月に何度も",
    ],
    quote: "「新刊チェックは人生の一部」",
    emoji: "📚",
    color: "#E91E63",
    image: "/images/sanzai-type/type-d.png",
  },
  superchat: {
    type: 'superchat',
    title: "スパチャ砲台",
    subtitle: "推しに届く課金は正義",
    description: "配信者への投げ銭が止まらないあなた！名前読まれると脳汁ドバドバ。推しの笑顔のためなら惜しくない。その直接的な応援スタイル、推しも嬉しいはず。",
    traits: [
      "推しの配信は最前列（スパチャ的な意味で）",
      "名前読まれた瞬間が至福",
      "メンバーシップは複数加入",
      "配信スケジュールに合わせて生活",
      "「投げ銭は応援」が信条",
    ],
    quote: "「推しに届く課金は正義」",
    emoji: "💸",
    color: "#7C4DFF",
    image: "/images/sanzai-type/type-e.png",
  },
  collab: {
    type: 'collab',
    title: "コラボ狩人",
    subtitle: "限定の2文字に勝てない",
    description: "コラボカフェ、コラボグッズ、コラボ何でも！「限定」の2文字に弱すぎるあなた。期間限定は全制覇がモットー。コラボカフェは聖地巡礼と同義。",
    traits: [
      "コラボ情報は誰よりも早くキャッチ",
      "コラボカフェは全メニュー制覇",
      "限定グッズは発売日に並ぶ",
      "「期間限定」に異常に反応する",
      "コラボ先の企業に感謝の気持ちがある",
    ],
    quote: "「限定の2文字に勝てない」",
    emoji: "🎯",
    color: "#00BCD4",
    image: "/images/sanzai-type/type-f.png",
  },
};

export function getResultByScores(scores: Record<SanzaiType, number>): Result {
  let maxType: SanzaiType = 'goods';
  let maxScore = 0;
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as SanzaiType;
    }
  }
  return results[maxType];
}

export function getTopTypes(scores: Record<SanzaiType, number>, count: number = 3): { type: SanzaiType; score: number }[] {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: type as SanzaiType, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
