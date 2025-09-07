// src/hooks/usePatternPlayer.ts
import { useState } from 'react';
import * as THREE from 'three';
import { buildRound } from '../lib/roundBuilder';
import { createYarnBetweenStitches } from '../lib/yarnConnector';

console.log('🔧 Debug:', { buildRound, createYarnBetweenStitches });

export function usePatternPlayer() {
  const [rounds, setRounds] = useState<THREE.Group[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  // Hardcoded amigurumi pattern (e.g., a ball)
  const pattern = [
    { round: 1, stitches: 6,  instruction: "6 sc in MR" },
    { round: 2, stitches: 12, instruction: "2 sc in each (12)" },
    { round: 3, stitches: 18, instruction: "[sc, inc] x6" },
    { round: 4, stitches: 24, instruction: "[2sc, inc] x6" },
    { round: 5, stitches: 30, instruction: "[3sc, inc] x6" },
  ];

  /**
   * Adds the next round to the 3D scene
   * @param scene - Three.js scene to add to
   */
  const addNextRound = (scene: THREE.Scene) => {
    if (currentRound >= pattern.length) return;

    const roundData = pattern[currentRound];
    const radius = Math.sqrt(roundData.stitches) * 0.25; // Scale radius by stitch count
    const height = currentRound * 0.6; // Stack vertically

    const newRound = buildRound(roundData.stitches, radius, height);

    // Connect to previous round with vertical yarns
    if (rounds.length > 0) {
      const prevRound = rounds[rounds.length - 1];
      const prevPositions = prevRound.userData.stitchPositions as THREE.Vector3[];
      const currPositions = newRound.userData.stitchPositions as THREE.Vector3[];

      // Connect each stitch in new round to one in previous round
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
    addNextRound
  };
}