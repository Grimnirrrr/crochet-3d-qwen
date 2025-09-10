// src/hooks/usePatternPlayer.ts
import { useState } from 'react';
import * as THREE from 'three';
import { buildRound } from '../lib/roundBuilder';
import { createYarnBetweenStitches } from '../lib/yarnConnector';

export function usePatternPlayer() {
  const [rounds, setRounds] = useState<THREE.Group[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  // Start with hardcoded pattern
  const [pattern, setPattern] = useState<{
    round?: number;
    stitches: number;
    instruction: string;
  }[]>([
    { round: 1, stitches: 6, instruction: "6 sc in MR" },
    { round: 2, stitches: 12, instruction: "2 sc in each (12)" },
    { round: 3, stitches: 18, instruction: "[sc, inc] x6" },
    { round: 4, stitches: 24, instruction: "[2sc, inc] x6" },
    { round: 5, stitches: 30, instruction: "[3sc, inc] x6" },
  ]);

  // Allow external pattern update
  const loadPattern = (text: string, isUSTerms: boolean = true) => {
    let processedText = text;

    if (!isUSTerms) {
      // Convert UK terms to US for internal parsing
      processedText = text
        .replace(/dc(?=\s)/g, 'sc')     // UK dc = US sc
        .replace(/tr(?=\s)/g, 'dc')     // UK tr = US dc
        .replace(/increase/gi, 'inc')
        .replace(/decrease/gi, 'dec');
    }

    const parsed = parsePattern(processedText);
    const newPattern = parsed.map((p, i) => ({
      round: i + 1,
      stitches: p.stitches,
      instruction: p.text
    }));
    setPattern(newPattern);
    reset();
  };

  const reset = () => {
    setRounds([]);
    setCurrentRound(0);
  };

  const addNextRound = (scene: THREE.Scene) => {
    if (currentRound >= pattern.length) return;

    const roundData = pattern[currentRound];
    const radius = Math.sqrt(roundData.stitches) * 0.25;
    const height = currentRound * 0.6;

    const newRound = buildRound(roundData.stitches, radius, height);

    if (rounds.length > 0) {
      const prevRound = rounds[rounds.length - 1];
      const prevPositions = prevRound.userData.stitchPositions as THREE.Vector3[];
      const currPositions = newRound.userData.stitchPositions as THREE.Vector3[];

      for (let i = 0; i < currPositions.length; i++) {
        const prevIndex = i % prevPositions.length;
        const yarn = createYarnBetweenStitches(
          prevPositions[prevIndex],
          currPositions[i],
          0.05
        );
        newRound.add(yarn);
      }
    }

    scene.add(newRound);
    setRounds([...rounds, newRound]);
    setCurrentRound(currentRound + 1);
  };

  return {
    rounds,
    currentRound,
    pattern,
    addNextRound,
    loadPattern
  };
}

// Standalone function: parsePattern
function parsePattern(text: string) {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  const result: { text: string; stitches: number }[] = [];
  let prev = 6; // Default for first round

  for (const line of lines) {
    const trimmed = line.trim();

    // --- Detect: [sc, inc] x6 ---
    const repeatMatch = trimmed.match(/\[(.+?)\]\s*x\s*(\d+)/i);
    if (repeatMatch) {
      const inner = repeatMatch[1];
      const repeatCount = parseInt(repeatMatch[2], 10);

      let stitchesInRepeat = 0;
      const parts = inner.split(',').map(p => p.trim());

      for (const part of parts) {
        if (part === 'inc') {
          stitchesInRepeat += 2;
        } else if (part === 'dec') {
          stitchesInRepeat += 1;
        } else {
          stitchesInRepeat += 1;
        }
      }

      const totalStitches = stitchesInRepeat * repeatCount;
      result.push({ text: trimmed, stitches: totalStitches });
      prev = totalStitches;
      continue;
    }

    // --- Extract (N) at end of line: (18) ---
    const parenMatch = trimmed.match(/\((\d+)\)$/);
    if (parenMatch) {
      const stitches = parseInt(parenMatch[1], 10);
      result.push({ text: trimmed, stitches });
      prev = stitches;
      continue;
    }

    // --- Fallback: extract numbers ---
    const numbers = trimmed.match(/\d+/g)?.map(Number) || [];

    let stitches = 0;
    if (trimmed.includes('MR') || trimmed.includes('magic ring')) {
      stitches = numbers[0] || 6;
    } else if (trimmed.includes('inc')) {
      stitches = Math.floor(prev * 1.5);
    } else if (numbers.length > 0) {
      stitches = numbers[numbers.length - 1];
    } else {
      stitches = prev;
    }

    result.push({ text: trimmed, stitches });
    prev = stitches;
  }

  return result;
}