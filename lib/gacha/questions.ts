export type KakinType = 'tenjou-kyouto' | 'shoudou-kakin' | 'bi-kakin' | 'mu-kakin' | 'gentei-killer' | 'hai-kakin';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<KakinType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "ガチャ画面を開いたとき、まず何を見る？",
    options: [
      { label: "天井までの回数を確認", scores: { 'tenjou-kyouto': 3 } },
      { label: "ピックアップキャラを見て即判断", scores: { 'shoudou-kakin': 3 } },
      { label: "石の残量と相談", scores: { 'bi-kakin': 2, 'mu-kakin': 1 } },
      { label: "「限定」「コラボ」の文字を探す", scores: { 'gentei-killer': 3 } },
      { label: "既に回す気満々", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 2,
    text: "推しキャラがピックアップに来た！",
    options: [
      { label: "天井分の石があるか確認してから", scores: { 'tenjou-kyouto': 3 } },
      { label: "即10連", scores: { 'shoudou-kakin': 3 } },
      { label: "無料分だけ回す", scores: { 'bi-kakin': 2, 'mu-kakin': 1 } },
      { label: "限定じゃないなら見送り", scores: { 'gentei-killer': 3 } },
      { label: "完凸するまで止まらない", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 3,
    text: "10連してSSRが出なかったとき",
    options: [
      { label: "天井まであと何回か計算する", scores: { 'tenjou-kyouto': 3 } },
      { label: "もう10連いっとく", scores: { 'shoudou-kakin': 2, 'hai-kakin': 1 } },
      { label: "今日はここまで", scores: { 'bi-kakin': 2, 'mu-kakin': 1 } },
      { label: "限定じゃないし撤退", scores: { 'gentei-killer': 3 } },
      { label: "出るまで回すしかない", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 4,
    text: "「お得パック」が販売されたら？",
    options: [
      { label: "石効率を計算して判断", scores: { 'tenjou-kyouto': 2, 'bi-kakin': 1 } },
      { label: "とりあえず買う", scores: { 'shoudou-kakin': 2, 'hai-kakin': 1 } },
      { label: "本当にお得なら買う", scores: { 'bi-kakin': 3 } },
      { label: "買わない", scores: { 'mu-kakin': 3 } },
      { label: "限定キャラに使えるなら買う", scores: { 'gentei-killer': 3 } },
    ],
  },
  {
    id: 5,
    text: "ガチャの確率、どう思う？",
    options: [
      { label: "確率は収束する、天井が正義", scores: { 'tenjou-kyouto': 3 } },
      { label: "運命を信じる", scores: { 'shoudou-kakin': 3 } },
      { label: "確率低いからこそ厳選する", scores: { 'bi-kakin': 3 } },
      { label: "だから課金しない", scores: { 'mu-kakin': 3 } },
      { label: "限定はしょうがない", scores: { 'gentei-killer': 3 } },
      { label: "確率？回せば出る", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 6,
    text: "月の課金額、大体どれくらい？",
    options: [
      { label: "計画的に予算内", scores: { 'tenjou-kyouto': 2, 'bi-kakin': 1 } },
      { label: "月による、波がある", scores: { 'shoudou-kakin': 2, 'gentei-killer': 1 } },
      { label: "数百円〜千円程度", scores: { 'bi-kakin': 3 } },
      { label: "0円", scores: { 'mu-kakin': 3 } },
      { label: "限定月だけ跳ねる", scores: { 'gentei-killer': 3 } },
      { label: "聞かないでくれ", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 7,
    text: "推しが引けなかったとき",
    options: [
      { label: "次の天井で確実に取る", scores: { 'tenjou-kyouto': 3 } },
      { label: "悔しいからもう少し回す", scores: { 'shoudou-kakin': 2, 'hai-kakin': 1 } },
      { label: "縁がなかったと諦める", scores: { 'bi-kakin': 2, 'mu-kakin': 1 } },
      { label: "復刻・限定再販を待つ", scores: { 'gentei-killer': 3 } },
      { label: "課金して取りに行く", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 8,
    text: "新キャラ実装、どう判断する？",
    options: [
      { label: "性能を見てから判断", scores: { 'tenjou-kyouto': 2, 'bi-kakin': 1 } },
      { label: "ビジュアルで即決", scores: { 'shoudou-kakin': 3 } },
      { label: "石と相談して慎重に", scores: { 'bi-kakin': 2, 'mu-kakin': 1 } },
      { label: "限定かどうかが最重要", scores: { 'gentei-killer': 3 } },
      { label: "推しなら性能関係ない", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 9,
    text: "「爆死」したことある？",
    options: [
      { label: "天井があるゲームしかやらない", scores: { 'tenjou-kyouto': 3 } },
      { label: "何度もある", scores: { 'shoudou-kakin': 2, 'hai-kakin': 1 } },
      { label: "深追いしないから大丈夫", scores: { 'bi-kakin': 3 } },
      { label: "課金しないから爆死もない", scores: { 'mu-kakin': 3 } },
      { label: "限定では何度か…", scores: { 'gentei-killer': 3 } },
      { label: "爆死は日常", scores: { 'hai-kakin': 3 } },
    ],
  },
  {
    id: 10,
    text: "ソシャゲ課金について一言",
    options: [
      { label: "計画的にやれば問題ない", scores: { 'tenjou-kyouto': 2, 'bi-kakin': 1 } },
      { label: "欲しいときが回しどき", scores: { 'shoudou-kakin': 3 } },
      { label: "無理のない範囲で楽しむ", scores: { 'bi-kakin': 3 } },
      { label: "無課金でも十分楽しめる", scores: { 'mu-kakin': 3 } },
      { label: "限定には弱い、それだけ", scores: { 'gentei-killer': 3 } },
      { label: "後悔はしていない", scores: { 'hai-kakin': 3 } },
    ],
  },
];
