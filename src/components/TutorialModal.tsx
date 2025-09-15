// src/components/TutorialModal.tsx

type TutorialModalProps = {
  onClose: () => void;
};

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2>How to Use This App</h2>
        <ol>
          <li>Type or paste a crochet pattern (e.g., "6 sc in MR")</li>
          <li>Click <strong>Visualize Pattern</strong></li>
          <li>Click <strong>Add Round</strong> to see each round grow in 3D</li>
          <li>Rotate the model with your mouse</li>
          <li>Use <strong>Save/Load</strong> to keep your work</li>
          <li>Export as JSON, SVG, or PDF</li>
        </ol>
        <p><em>Tip: Try "US/UK" toggle if your pattern uses different terms.</em></p>
        <button onClick={onClose} style={{ marginTop: '16px' }}>Got it!</button>
      </div>
    </div>
  );
}