// src/App.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createSingleCrochet } from './lib/stitchPrimitives';
import { createYarnBetweenStitches } from './lib/yarnConnector';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee);

    const mount = mountRef.current;
    mount?.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // --- Camera Position ---
    camera.position.z = 3;

    // --- Manual Rotation ---
    let mouseX = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    });

    // --- Create Two Stitches ---
    const stitch1 = createSingleCrochet();
    stitch1.position.set(-1, 0, 0);
    scene.add(stitch1);

    const stitch2 = createSingleCrochet();
    stitch2.position.set(1, 0, 0);
    scene.add(stitch2);

    // --- Connect with Yarn ---
    const yarn = createYarnBetweenStitches(
      stitch1.position,
      stitch2.position,
      0.15
    );
    scene.add(yarn);

    // --- Animation Loop ---
    function animate() {
      requestAnimationFrame(animate);

      // Rotate camera
      camera.position.x = Math.sin(mouseX * Math.PI) * 3;
      camera.position.z = Math.cos(mouseX * Math.PI) * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // --- Cleanup ---
    return () => {
      document.removeEventListener('mousemove', () => {});
      mount?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}
    />
  );
}