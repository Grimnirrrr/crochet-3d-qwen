// src/lib/patternHints.ts
export function getHintForLine(instruction: string): string | null {
  instruction = instruction.toLowerCase();

  if (instruction.includes('mr') || instruction.includes('magic ring')) {
    return 'MR = Magic Ring: start with 6 stitches in an adjustable ring.';
  }
  if (instruction.includes('inc')) {
    return 'inc = increase: work 2 stitches in the same stitch.';
  }
  if (instruction.includes('dec')) {
    return 'dec = decrease: work 2 stitches together to reduce count.';
  }
  if (instruction.includes('sc')) {
    return 'sc = single crochet: one stitch into the next stitch.';
  }
  if (instruction.includes('dc')) {
    return 'dc = double crochet: yarn over, insert hook, pull up a loop, complete the stitch.';
  }

  return null;
}
