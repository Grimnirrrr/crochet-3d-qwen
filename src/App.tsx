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
    camera.position.z = 5;

    // --- Manual Rotation (from D0.3) ---
    let mouseX = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    });

    // --- Create Two Stitches (Spheres) ---
    const stitch1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 12),
      new THREE.MeshPhongMaterial({ color: 0xfbbf24 }) // Gold color
    );
    stitch1.position.set(-1.5, 0, 0);
    scene.add(stitch1);

    const stitch2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 12),
      new THREE.MeshPhongMaterial({ color: 0xfbbf24 })
    );
    stitch2.position.set(1.5, 0, 0);
    scene.add(stitch2);

    // --- Create Curved Yarn Between Stitches ---
    // Add a control point to create a sag (realistic yarn droop)
    const midPoint = new THREE.Vector3(0, -0.5, 0); // Y is lower = sag

    const curve = new THREE.CatmullRomCurve3([
      stitch1.position.clone(),
      midPoint,
      stitch2.position.clone()
    ]);

    // Create a tube around the curve
    const tubeGeometry = new THREE.TubeGeometry(
      curve,     // The path
      20,        // Segments along the path
      0.05,      // Radius of the tube (yarn thickness)
      8,         // Number of segments around the tube
      false      // No closed loop
    );

    const yarnMaterial = new THREE.MeshPhongMaterial({
      color: 0xf59e0b, // Amber yarn
      opacity: 0.9,
      transparent: true
    });

    const yarnTube = new THREE.Mesh(tubeGeometry, yarnMaterial);
    scene.add(yarnTube);

    // --- Animation Loop ---
    function animate() {
      requestAnimationFrame(animate);

      // Rotate camera
      camera.position.x = Math.sin(mouseX * Math.PI) * 5;
      camera.position.z = Math.cos(mouseX * Math.PI) * 5;
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