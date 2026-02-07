export type SanzaiType = 'goods' | 'ensei' | 'gacha' | 'doujin' | 'superchat' | 'collab';

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<SanzaiType, number>>;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: "給料日にまずすること？",
    options: [
      { label: "通販サイトのカートを精算", scores: { goods: 3 } },
      { label: "次のイベントの交通費を確保", scores: { ensei: 3 } },
      { label: "ガチャの石を買う", scores: { gacha: 3 } },
      { label: "委託通販サイトをチェック", scores: { doujin: 3 } },
      { label: "推し配信者のメンバーシップ更新", scores: { superchat: 3 } },
    ],
  },
  {
    id: 2,
    text: "「金欠」の主な原因は？",
    options: [
      { label: "グッズのランダム商品を箱買いした", scores: { goods: 3 } },
      { label: "遠征の新幹線代", scores: { ensei: 3 } },
      { label: "天井まで回した", scores: { gacha: 3 } },
      { label: "即売会で予算オーバー", scores: { doujin: 3 } },
      { label: "スパチャしすぎた", scores: { superchat: 2, collab: 1 } },
    ],
  },
  {
    id: 3,
    text: "部屋を見渡すと何が多い？",
    options: [
      { label: "アクスタ、缶バッジ、ぬいぐるみの山", scores: { goods: 3 } },
      { label: "各地のお土産とライブグッズ", scores: { ensei: 3 } },
      { label: "スマホのスクショ（ガチャ結果）", scores: { gacha: 3 } },
      { label: "同人誌の本棚がパンパン", scores: { doujin: 3 } },
      { label: "推しのサイン色紙やスクショ", scores: { superchat: 2, collab: 1 } },
    ],
  },
  {
    id: 4,
    text: "「限定」という文字を見たら？",
    options: [
      { label: "限定グッズなら即ポチ", scores: { goods: 2, collab: 1 } },
      { label: "限定イベントなら即遠征計画", scores: { ensei: 3 } },
      { label: "限定ガチャなら即回す", scores: { gacha: 3 } },
      { label: "限定本なら即チェック", scores: { doujin: 3 } },
      { label: "限定コラボなら全力で行く", scores: { collab: 3 } },
    ],
  },
  {
    id: 5,
    text: "オタク趣味の年間支出、正直どのくらい？",
    options: [
      { label: "グッズだけで10万超え", scores: { goods: 3 } },
      { label: "遠征費で20万は飛ぶ", scores: { ensei: 3 } },
      { label: "ガチャで計算したくない", scores: { gacha: 3 } },
      { label: "同人誌で5万は使う", scores: { doujin: 3 } },
      { label: "スパチャ合計見たら震える", scores: { superchat: 3 } },
    ],
  },
  {
    id: 6,
    text: "節約しようと決意。最初に削るのは？",
    options: [
      { label: "食費（趣味は削れない）", scores: { goods: 2, gacha: 1 } },
      { label: "何も削れない…全部必要…", scores: { ensei: 2, collab: 1 } },
      { label: "課金額の上限を設定する（すぐ破る）", scores: { gacha: 3 } },
      { label: "通販を月1回に制限する（すぐ破る）", scores: { doujin: 3 } },
      { label: "推しが配信してなければ我慢できる", scores: { superchat: 3 } },
    ],
  },
  {
    id: 7,
    text: "フリマアプリ、何に使ってる？",
    options: [
      { label: "ダブったグッズを売って軍資金に", scores: { goods: 3 } },
      { label: "行けなかったイベントの限定グッズを買う", scores: { ensei: 2, collab: 1 } },
      { label: "使わない。ガチャは売れないし", scores: { gacha: 3 } },
      { label: "完売した同人誌を探す", scores: { doujin: 3 } },
      { label: "推しの配信切り抜きグッズとか", scores: { superchat: 2, goods: 1 } },
    ],
  },
  {
    id: 8,
    text: "友達に「またお金使ったの？」と言われたら？",
    options: [
      { label: "「だって新作グッズ出たから…」", scores: { goods: 3 } },
      { label: "「遠征は人生の投資だから」", scores: { ensei: 3 } },
      { label: "「天井まで行っちゃって…」", scores: { gacha: 3 } },
      { label: "「この作家さんの新刊は買うしかない」", scores: { doujin: 3 } },
      { label: "「推しが喜んでくれたからいいの」", scores: { superchat: 3 } },
    ],
  },
  {
    id: 9,
    text: "理想のオタクライフに必要なものは？",
    options: [
      { label: "無限の収納スペース", scores: { goods: 3 } },
      { label: "全国どこでも瞬間移動", scores: { ensei: 3 } },
      { label: "天井のないガチャ", scores: { gacha: 3 } },
      { label: "即売会が毎週ある世界", scores: { doujin: 3 } },
      { label: "推しとの直接交流チャンネル", scores: { superchat: 3 } },
    ],
  },
  {
    id: 10,
    text: "ぶっちゃけ、一番幸せな散財の瞬間は？",
    options: [
      { label: "推しのグッズをコンプした時", scores: { goods: 3 } },
      { label: "ライブで最前列取れた時", scores: { ensei: 3 } },
      { label: "ガチャで一発で引けた時", scores: { gacha: 3 } },
      { label: "欲しかった本を手に入れた時", scores: { doujin: 3 } },
      { label: "スパチャ読まれた時", scores: { superchat: 3 } },
      { label: "コラボメニュー全制覇した時", scores: { collab: 3 } },
    ],
  },
];
