// src/lib/roundBuilder.ts
import * as THREE from 'three';
import { createSingleCrochet } from './stitchPrimitives';
import { createYarnBetweenStitches } from './yarnConnector';

/**
 * Builds a circular round of stitches
 * @param stitchCount - Number of stitches (e.g., 6 for MR)
 * @param radius - Radius of the circle
 * @param height - Y position (for stacking rounds)
 */
export function buildRound(
  stitchCount: number,
  radius: number,
  height: number
): THREE.Group {
  const round = new THREE.Group();
  const stitches: THREE.Group[] = [];

  // --- Place stitches in a circle ---
  for (let i = 0; i < stitchCount; i++) {
    const angle = (i / stitchCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const stitch = createSingleCrochet();
    stitch.position.set(x, height, z);
    stitches.push(stitch);
    round.add(stitch);
  }

  // --- Connect stitches with yarn ---
  for (let i = 0; i < stitches.length; i++) {
    const current = stitches[i];
    const next = stitches[(i + 1) % stitches.length]; // Loop back to first

    const yarn = createYarnBetweenStitches(
      current.position,
      next.position,
      0.1
    );
    round.add(yarn);
  }

  // --- Store stitch positions for vertical connections later ---
  round.userData = {
    stitchPositions: stitches.map(s => s.position.clone())
  };

  return round;
}
