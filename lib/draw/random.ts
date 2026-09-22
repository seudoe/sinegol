/**
 * Draws 5 unique numbers in the 1-45 range (same range as golf scores —
 * see docs/assumptions.md for the score-to-number mapping this implies).
 */
export function drawRandomNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}
