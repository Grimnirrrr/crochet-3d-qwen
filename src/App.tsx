// src/App.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePatternPlayer } from './hooks/usePatternPlayer';
import { PatternInput } from './components/PatternInput';
import { getHintForLine } from './lib/patternHints';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // ✅ Destructure ALL functions in one place
  const {
    currentRound,
    pattern,
    addNextRound,
    loadPattern,
    savePattern,
    loadPatternFromStorage,
    exportToJson,
    exportToSvg,
    exportToPdf
  } = usePatternPlayer();

  useEffect(() => {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Black background

    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    sceneRef.current = scene;

    // --- Lighting ---
    const ambient = new THREE.AmbientLight(0x606060); // Brighter ambient
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // --- Camera Position ---
    camera.position.z = 8;

    // --- Manual Rotation ---
    let mouseX = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    });

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    function animate() {
      requestAnimationFrame(animate);
      camera.position.x = Math.sin(mouseX * Math.PI) * 8;
      camera.position.z = Math.cos(mouseX * Math.PI) * 8;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', () => {});
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 3D View */}
      <div
        ref={mountRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          minHeight: '100vh',
          minWidth: '500px',
          backgroundColor: '#000'
        }}
      />

      {/* Controls Panel */}
      <div
        style={{
          width: 250,
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderLeft: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <h2>Amigurumi Builder</h2>

        {/* Pattern Input */}
        <PatternInput onParse={(text, isUSTerms) => loadPattern(text, isUSTerms)} />

        {/* Save/Load Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={savePattern} style={buttonStyle('#17a2b8')}>Save</button>
          <button onClick={loadPatternFromStorage} style={buttonStyle('#28a745')}>Load</button>
        </div>

        {/* Add Round Button */}
        <button
          onClick={() => sceneRef.current && addNextRound(sceneRef.current)}
          style={buttonStyle('#007bff', '16px', '12px')}
        >
          Add Round {currentRound + 1}
        </button>

        {/* Instruction */}
        <div>
          <strong>Next Instruction:</strong>
          <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.5 }}>
            {pattern[currentRound]?.instruction || "Pattern complete!"}
          </p>
        </div>

        {/* Hint */}
        {pattern[currentRound] && (
          <div style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#555',
            padding: '8px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee'
          }}>
            {getHintForLine(pattern[currentRound].instruction)}
          </div>
        )}

        {/* Progress */}
        <div>
          <strong>Progress:</strong>
          <p style={{ fontSize: '14px' }}>
            {currentRound} / {pattern.length} rounds added
          </p>
        </div>

        {/* Export */}
        <div style={{ marginTop: '16px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
          <strong>Export</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <button onClick={exportToJson} style={buttonStyle('#6f42c1')}>Export JSON</button>
            <button onClick={exportToSvg} style={buttonStyle('#d97706')}>Export SVG</button>
            <button onClick={exportToPdf} style={buttonStyle('#0d6efd')}>Export PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable button style
const buttonStyle = (bgColor: string, fontSize = '14px', padding = '8px') => ({
  padding,
  fontSize,
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});