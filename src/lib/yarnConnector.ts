// src/lib/yarnConnector.ts
import * as THREE from 'three';

/**
 * Creates a curved yarn tube between two 3D points
 * @param start - Starting position (e.g., end of stitch 1)
 * @param end - Ending position (e.g., start of stitch 2)
 * @param tension - How much the yarn sags (0.1 = slight droop)
 */
export function createYarnBetweenStitches(
  start: THREE.Vector3,
  end: THREE.Vector3,
  tension: number = 0.1
): THREE.Mesh {
  // Create a control point to make yarn sag naturally
  const midPoint = new THREE.Vector3(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2 - tension, // Y is lower = realistic droop
    (start.z + end.z) / 2
  );

  // Create a smooth curve through the three points
  const curve = new THREE.CatmullRomCurve3([start, midPoint, end], false, 'catmullrom', 0.5);

  // Turn the curve into a 3D tube (yarn)
  const tubeGeometry = new THREE.TubeGeometry(
    curve,
    20,     // segments along the path
    0.03,   // yarn thickness
    8,      // radial segments (8 = octagonal tube)
    false   // not closed
  );

  const yarnMaterial = new THREE.MeshPhongMaterial({
    color: 0xfbbf24,     // golden yellow
    opacity: 0.9,
    transparent: true,
    shininess: 60
  });

  return new THREE.Mesh(tubeGeometry, yarnMaterial);
}
