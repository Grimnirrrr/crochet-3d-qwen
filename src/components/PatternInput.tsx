// src/components/PatternInput.tsx
import { useState } from 'react';

export function PatternInput({ onParse }) {
  const [text, setText] = useState(`6 sc in MR
2 sc in each (12)
[sc, inc] x6 (18)
[2sc, inc] x6 (24)`);

  const handleParse = () => {
    onParse(text);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Crochet Pattern (Text)
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
        placeholder="Enter pattern here..."
      />
      <button
        onClick={handleParse}
        style={{
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Visualize Pattern
      </button>
    </div>
  );
}
