// src/lib/simpleParser.ts
/**
 * Parses a text crochet pattern into structured rounds
 * Simple logic: extract stitch count from numbers and keywords
 */
export function parsePattern(text: string) {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  const rounds: {
    text: string;
    stitches: number;
    hasIncrease: boolean;
    hasDecrease: boolean;
  }[] = [];

  let prevStitchCount = 6; // Default for first round

  for (const line of lines) {
    const trimmed = line.trim();
    const numbers = trimmed.match(/\d+/g)?.map(Number) || [];
    let stitchCount = 0;

    // Detect Magic Ring (MR) or "in ring"
    if (trimmed.includes('MR') || trimmed.includes('magic ring')) {
      stitchCount = numbers[0] || 6;
    }
    // Detect increases: "inc", "2 in each", "(12)" suggests growth
    else if (trimmed.includes('inc') || trimmed.includes('each')) {
      stitchCount = Math.floor(prevStitchCount * 1.5); // Common: +50%
    }
    // Use last number in line (e.g., "(18)")
    else if (numbers.length > 0) {
      stitchCount = numbers[numbers.length - 1];
    }
    // Fallback: same as previous
    else {
      stitchCount = prevStitchCount;
    }

    rounds.push({
      text: trimmed,
      stitches: stitchCount,
      hasIncrease: trimmed.includes('inc'),
      hasDecrease: trimmed.includes('dec')
    });

    prevStitchCount = stitchCount;
  }

  return rounds;
}
