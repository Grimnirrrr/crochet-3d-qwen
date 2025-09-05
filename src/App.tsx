// src/App.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    camera.position.z = 10; // Pull back for 500 stitches

    // --- Manual Rotation ---
    let mouseX = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    });

    // --- Group to Hold All Stitches ---
    const stitchesGroup = new THREE.Group();
    scene.add(stitchesGroup);

    // --- Create 500 Stitches in a Spiral Pattern ---
    const count = 500;

    for (let i = 0; i < count; i++) {
      const angle = i * 0.4; // Fibonacci-like spiral
      const x = Math.cos(angle) * angle * 0.2;
      const y = Math.sin(angle) * angle * 0.2;
      const z = i * 0.02;

      const stitch = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 6),
        new THREE.MeshPhongMaterial({
          color: 0xfbbf24,
          shininess: 30
        })
      );
      stitch.position.set(x, y, z);
      stitchesGroup.add(stitch);
    }

    console.log('✅ 500 stitches added');
    console.log('Geometries:', renderer.info.memory.geometries);
    console.log('Textures:', renderer.info.memory.textures);
    console.log('Programs:', renderer.info.programs?.length ?? 'unknown');

    // Optional: Log memory every 3 seconds
    const memoryInterval = setInterval(() => {
      console.log('📊 Memory Info:', renderer.info.memory);
    }, 3000);

    // --- Animation Loop ---
    function animate() {
      requestAnimationFrame(animate);

      // Rotate camera
      camera.position.x = Math.sin(mouseX * Math.PI) * 15;
      camera.position.z = Math.cos(mouseX * Math.PI) * 15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // --- Cleanup ---
    return () => {
      clearInterval(memoryInterval);
      document.removeEventListener('mousemove', () => {});

      // Dispose of all stitches
      stitchesGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });

      scene.remove(stitchesGroup);
      mount?.removeChild(renderer.domElement);
      renderer.dispose();

      console.log('🗑️ Memory cleaned up');
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