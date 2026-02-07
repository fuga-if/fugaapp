/**
 * @module theomachia/server/utils
 * @description ユーティリティ関数。
 */

/**
 * 配列をFisher-Yatesアルゴリズムでシャッフルする。
 * 元の配列は変更されず、新しい配列を返す。
 *
 * @param array - シャッフル対象の配列
 * @returns シャッフルされた新しい配列
 *
 * @example
 * ```typescript
 * const deck = shuffle(["a", "b", "c", "d"]);
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
