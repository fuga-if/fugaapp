export interface MemoryRank {
  rank: string;
  title: string;
  threshold: number; // レベル以上でこのランク
  description: string;
  emoji: string;
  color: string;
}

const ranks: MemoryRank[] = [
  { rank: "S", title: "超記憶脳", threshold: 15, description: "驚異的な記憶力！忘れることを忘れるレベル", emoji: "🧠", color: "#FFD700" },
  { rank: "A", title: "カメラアイ", threshold: 11, description: "素晴らしい記憶力！見たものを正確に覚える", emoji: "📸", color: "#FF6B35" },
  { rank: "B", title: "記憶上手", threshold: 8, description: "平均以上の記憶力。頼りになる脳みそ", emoji: "💡", color: "#4ECDC4" },
  { rank: "C", title: "ふつうの脳", threshold: 5, description: "平均的な記憶力。日常には十分！", emoji: "🌱", color: "#45B7D1" },
  { rank: "D", title: "サカナ並み？", threshold: 3, description: "ちょっと忘れっぽい。メモを取ろう！", emoji: "🐟", color: "#96CEB4" },
  { rank: "E", title: "瞬間記憶…", threshold: 0, description: "見た瞬間に忘れる天才。ある意味すごい", emoji: "💨", color: "#A8A8A8" },
];

export function getRank(level: number): MemoryRank {
  return ranks.find((r) => level >= r.threshold) || ranks[ranks.length - 1];
}

export interface LevelConfig {
  gridSize: number;
  panelCount: number;
  displayTime: number; // ms per panel
}

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 3) {
    return { gridSize: 3, panelCount: level + 1, displayTime: 1500 };
  }
  if (level <= 6) {
    const configs: Record<number, LevelConfig> = {
      4: { gridSize: 4, panelCount: 4, displayTime: 1200 },
      5: { gridSize: 4, panelCount: 5, displayTime: 1200 },
      6: { gridSize: 4, panelCount: 6, displayTime: 1000 },
    };
    return configs[level];
  }
  if (level <= 9) {
    const configs: Record<number, LevelConfig> = {
      7: { gridSize: 5, panelCount: 6, displayTime: 1000 },
      8: { gridSize: 5, panelCount: 7, displayTime: 800 },
      9: { gridSize: 5, panelCount: 8, displayTime: 800 },
    };
    return configs[level];
  }
  // Level 10+
  return { gridSize: 6, panelCount: level, displayTime: 600 };
}
