// 色覚多様性チェック - 結果データ

export interface ResultType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
}

export const resultTypes: Record<string, ResultType> = {
  "type-c": {
    id: "type-c",
    title: "一般型色覚（C型）",
    subtitle: "最も一般的な色の見え方",
    description:
      "全問正解またはほぼ正解！一般的な色覚（C型）の可能性が高いです。赤・緑・青を正常に識別できています。ただし、このテストは簡易的なものなので、正確な判定は眼科で検査を受けてください。",
    emoji: "🌈",
    color: "#10B981",
  },
  "type-p": {
    id: "type-p",
    title: "P型傾向（赤系識別タイプ）",
    subtitle: "赤系の色が見えにくい傾向",
    description:
      "赤系の色を識別する問題で間違いが多かったようです。P型色覚の傾向があるかもしれません。P型は赤系の色が見えにくく、赤と緑、オレンジと黄緑などの区別が難しい場合があります。気になる場合は眼科で正式な検査を受けてみてください。",
    emoji: "🔴",
    color: "#EF4444",
  },
  "type-d": {
    id: "type-d",
    title: "D型傾向（緑系識別タイプ）",
    subtitle: "緑系の色が見えにくい傾向",
    description:
      "緑系の色を識別する問題で間違いが多かったようです。D型色覚の傾向があるかもしれません。D型は緑系の色が見えにくく、赤と緑、茶色と緑などの区別が難しい場合があります。気になる場合は眼科で正式な検査を受けてみてください。",
    emoji: "🟢",
    color: "#22C55E",
  },
  "type-t": {
    id: "type-t",
    title: "T型傾向（青系識別タイプ）",
    subtitle: "青系の色が見えにくい傾向",
    description:
      "青系の色を識別する問題で間違いが多かったようです。T型色覚の傾向があるかもしれません。T型は非常に稀で、青と黄色の区別が難しい場合があります。気になる場合は眼科で正式な検査を受けてみてください。",
    emoji: "🔵",
    color: "#3B82F6",
  },
};

export function getResultType(typeId: string): ResultType {
  return resultTypes[typeId] || resultTypes["type-c"];
}
