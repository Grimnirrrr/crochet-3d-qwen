// src/App.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee); // Light gray background

    // Add canvas to DOM
    const mount = mountRef.current;
    mount?.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // --- Green Cube (Placeholder) ---
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // --- Camera Initial Position ---
    camera.position.z = 5;

    // --- Manual Rotation: Mouse Control ---
    let mouseX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse X (0 → window.innerWidth) to -1 → +1
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate camera around Y axis based on mouse X
      const radius = 5;
      camera.position.x = Math.sin(mouseX * Math.PI) * radius;
      camera.position.z = Math.cos(mouseX * Math.PI) * radius;
      camera.lookAt(0, 0, 0); // Always look at center

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup on Unmount ---
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
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