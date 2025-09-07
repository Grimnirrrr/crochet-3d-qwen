// src/lib/stitchPrimitives.ts
import * as THREE from 'three';

/**
 * Creates a single crochet stitch
 * Shape: Sphere (body) + small cylinder (yarn tail)
 */
export function createSingleCrochet(): THREE.Group {
  const group = new THREE.Group();

  // Main body - sphere
  const bodyGeometry = new THREE.SphereGeometry(0.15, 16, 12);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0xfbbf24, // Golden yellow
    shininess: 80,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Yarn entry tail (small vertical cylinder at bottom)
  const tailGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8);
  const tailMaterial = new THREE.MeshPhongMaterial({
    color: 0xf59e0b, // Slightly darker
    shininess: 60,
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.y = -0.12;
  tail.rotation.x = Math.PI / 2; // Lie flat
  group.add(tail);

  return group;
}

/**
 * Creates a double crochet stitch
 * Shape: Taller, elongated form using scaled sphere
 */
export function createDoubleCrochet(): THREE.Group {
  const group = new THREE.Group();

  // Body - sphere stretched vertically
  const bodyGeometry = new THREE.SphereGeometry(0.12, 16, 12);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0xf59e0b, // Amber
    shininess: 80,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1, 2.2, 1); // Make it tall like a dc
  group.add(body);

  // Top "loop" detail (optional small cylinder)
  const loopGeometry = new THREE.CylinderGeometry(0.03, 0.01, 0.04, 8);
  const loopMaterial = new THREE.MeshPhongMaterial({
    color: 0xfee0a2, // Light yarn tip
  });
  const loop = new THREE.Mesh(loopGeometry, loopMaterial);
  loop.position.y = 0.25;
  group.add(loop);

  return group;
}
