// src/hooks/usePatternPlayer.ts
import { useState, useEffect } from 'react';
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

  // Reset 3D scene
  const reset = () => {
    setRounds([]);
    setCurrentRound(0);
  };

  // Save current pattern to localStorage
  const savePattern = () => {
    const data = {
      pattern: pattern.map(p => ({
        stitches: p.stitches,
        instruction: p.instruction
      })),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('crochet-pattern', JSON.stringify(data));
    console.log('✅ Pattern saved to local storage');
  };

  // Load pattern from localStorage
  const loadPatternFromStorage = () => {
    const saved = localStorage.getItem('crochet-pattern');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const newPattern = data.pattern.map((p: any, i: number) => ({
          round: i + 1,
          stitches: p.stitches,
          instruction: p.instruction
        }));
        setPattern(newPattern);
        reset(); // Clear 3D model before rebuild
        console.log('✅ Loaded pattern from local storage');
      } catch (e) {
        console.error('Failed to load pattern:', e);
      }
    }
  };

  // Auto-save whenever pattern or rounds change
  const autoSave = () => {
    const data = {
      pattern: pattern.map(p => ({
        stitches: p.stitches,
        instruction: p.instruction
      })),
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem('crochet-pattern-autosave', JSON.stringify(data));
    } catch (e) {
      console.warn('Auto-save failed:', e);
    }
  };

  // Try to load autosave on startup
  useEffect(() => {
    const saved = localStorage.getItem('crochet-pattern-autosave');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const newPattern = data.pattern.map((p: any, i: number) => ({
          round: i + 1,
          stitches: p.stitches,
          instruction: p.instruction
        }));
        setPattern(newPattern);
        console.log('🔁 Restored from auto-save');
      } catch (e) {
        console.warn('Failed to load auto-saved pattern', e);
      }
    }
  }, []);

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
    autoSave(); // Save after loading
  };

  // Add next round to 3D scene
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
    autoSave(); // Save after each round
  };

  // Export to JSON
  const exportToJson = () => {
    const data = {
      app: "CrochetAmigurumiEngine-v5.0-BULLETPROOF",
      exportedAt: new Date().toISOString(),
      pattern: pattern.map((p, i) => ({
        round: i + 1,
        instruction: p.instruction,
        stitchCount: p.stitches
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crochet-pattern-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to SVG
  const exportToSvg = () => {
    const radius = 100;
    const centerX = 150;
    const centerY = 150;
    let circles = '';

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius + centerX;
      const y = Math.sin(angle) * radius + centerY;
      circles += `<circle cx="${x}" cy="${y}" r="15" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>`;
    }

    const svgContent = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff"/>
        ${circles}
        <text x="150" y="30" text-anchor="middle" font-size="14" fill="#000">First Round: 6 sc in MR</text>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crochet-diagram-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to PDF
  const exportToPdf = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    if (!printWindow) return;

    const content = `
      <h1>Crochet Pattern</h1>
      <p><strong>Generated by:</strong> CrochetAmigurumiEngine-v5.0</p>
      <h2>Instructions</h2>
      <ol>
        ${pattern.map(p => `<li>${p.instruction} (${p.stitches} sts)</li>`).join('')}
      </ol>
      <p><em>Print this page as PDF using your browser's print dialog.</em></p>
    `;

    printWindow.document.write(`
      <html>
        <head><title>Crochet Pattern</title></head>
        <body style="font-family:Arial;padding:20px">${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Expose all functions and state
  return {
    rounds,
    currentRound,
    pattern,
    addNextRound,
    loadPattern,
    savePattern,
    loadPatternFromStorage,
    exportToJson,
    exportToSvg,
    exportToPdf
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