// 色覚多様性チェック - 変換型問題データ
// 2つの数字を重ねて表示、色覚タイプで見える数字が変わる

export interface Question {
  // 背景色（黄緑系）
  bgColors: [number, number, number][];
  // 数字A（通常視で見える）の色
  numAColor: [number, number, number];
  // 数字B（色覚特性で相対的に見える）の色  
  numBColor: [number, number, number];
  // 数字
  numA: string;
  numB: string;
  // 検出対象
  type: "p" | "d" | "t" | "all";
  // 正解（通常視での答え）
  normalAnswer: string;
  // 色覚特性での答え
  cbAnswer: string;
}

export const questions: Question[] = [
  // === P型/D型検出（赤緑系）===
  {
    bgColors: [[150, 180, 90], [160, 170, 100], [140, 175, 95]],
    numAColor: [230, 100, 80],   // 赤橙（通常視で浮く、P型で沈む）
    numBColor: [100, 120, 180],  // 青（両方見えるが、Aが消えると目立つ）
    numA: "5",
    numB: "2",
    type: "p",
    normalAnswer: "5",
    cbAnswer: "2",
  },
  {
    bgColors: [[160, 175, 85], [150, 180, 95], [155, 170, 90]],
    numAColor: [220, 90, 70],
    numBColor: [90, 110, 170],
    numA: "7",
    numB: "4",
    type: "p",
    normalAnswer: "7",
    cbAnswer: "4",
  },
  {
    bgColors: [[145, 185, 100], [155, 175, 90], [150, 180, 95]],
    numAColor: [210, 80, 90],
    numBColor: [80, 100, 160],
    numA: "8",
    numB: "3",
    type: "p",
    normalAnswer: "8",
    cbAnswer: "3",
  },
  
  // === D型検出 ===
  {
    bgColors: [[180, 150, 90], [170, 160, 100], [175, 155, 95]],
    numAColor: [100, 190, 80],   // 緑（D型で沈む）
    numBColor: [100, 100, 180],  // 青
    numA: "6",
    numB: "9",
    type: "d",
    normalAnswer: "6",
    cbAnswer: "9",
  },
  {
    bgColors: [[175, 155, 85], [185, 145, 95], [180, 150, 90]],
    numAColor: [90, 180, 70],
    numBColor: [90, 90, 170],
    numA: "3",
    numB: "8",
    type: "d",
    normalAnswer: "3",
    cbAnswer: "8",
  },
  {
    bgColors: [[170, 160, 95], [180, 150, 85], [175, 155, 90]],
    numAColor: [80, 170, 60],
    numBColor: [80, 80, 160],
    numA: "2",
    numB: "7",
    type: "d",
    normalAnswer: "2",
    cbAnswer: "7",
  },

  // === T型検出（青黄系）===
  {
    bgColors: [[180, 180, 120], [190, 175, 110], [185, 178, 115]],
    numAColor: [80, 120, 200],   // 青（T型で沈む）
    numBColor: [200, 80, 100],   // 赤（T型で見える）
    numA: "4",
    numB: "1",
    type: "t",
    normalAnswer: "4",
    cbAnswer: "1",
  },
  {
    bgColors: [[185, 175, 115], [175, 185, 125], [180, 180, 120]],
    numAColor: [70, 110, 190],
    numBColor: [190, 70, 90],
    numA: "9",
    numB: "6",
    type: "t",
    normalAnswer: "9",
    cbAnswer: "6",
  },

  // === 確認問題（全員同じに見える）===
  {
    bgColors: [[60, 60, 60], [70, 70, 70], [65, 65, 65]],
    numAColor: [255, 220, 100],  // 明るい黄色
    numBColor: [255, 220, 100],  // 同じ（両方見える）
    numA: "1",
    numB: "1",
    type: "all",
    normalAnswer: "1",
    cbAnswer: "1",
  },
  {
    bgColors: [[220, 220, 220], [230, 230, 230], [225, 225, 225]],
    numAColor: [30, 30, 30],     // 黒
    numBColor: [30, 30, 30],     // 同じ
    numA: "0",
    numB: "0",
    type: "all",
    normalAnswer: "0",
    cbAnswer: "0",
  },
];

// 選択肢を生成
export function getChoices(q: Question): string[] {
  if (q.type === "all") {
    return [q.numA, "8", "6", "見えにくい"];
  }
  // numA, numB, 両方見える, 見えにくい をシャッフル
  const choices = [q.numA, q.numB, "両方見える", "見えにくい"];
  // シャッフルはしない（一貫性のため）
  return choices;
}

// 結果分析
export interface AnalysisResult {
  type: string;
  pScore: number;  // P型傾向スコア
  dScore: number;  // D型傾向スコア
  tScore: number;  // T型傾向スコア
  normalScore: number;  // 通常回答数
  details: {
    questionType: string;
    answer: string;
    wasNormal: boolean;
    wasCB: boolean;
  }[];
}

export function analyzeResults(answers: (string | null)[]): AnalysisResult {
  let pScore = 0;
  let dScore = 0;
  let tScore = 0;
  let normalScore = 0;
  
  const details = questions.map((q, i) => {
    const answer = answers[i];
    const wasNormal = answer === q.normalAnswer;
    const wasCB = answer === q.cbAnswer && q.numA !== q.numB;
    
    if (wasNormal) normalScore++;
    
    // 色覚特性側の回答をした場合、該当タイプのスコア加算
    if (wasCB) {
      if (q.type === "p") pScore++;
      if (q.type === "d") dScore++;
      if (q.type === "t") tScore++;
    }
    
    return {
      questionType: q.type,
      answer: answer || "",
      wasNormal,
      wasCB,
    };
  });

  // タイプ判定
  let type = "type-c";  // デフォルトは一般型
  
  // 確認問題以外で8問中6問以上正解なら一般型
  const nonAllQuestions = questions.filter(q => q.type !== "all").length;
  if (normalScore >= nonAllQuestions - 1) {
    type = "type-c";
  } else if (pScore >= 2 && pScore >= dScore && pScore >= tScore) {
    type = "type-p";
  } else if (dScore >= 2 && dScore >= pScore && dScore >= tScore) {
    type = "type-d";
  } else if (tScore >= 2) {
    type = "type-t";
  }

  return { type, pScore, dScore, tScore, normalScore, details };
}
