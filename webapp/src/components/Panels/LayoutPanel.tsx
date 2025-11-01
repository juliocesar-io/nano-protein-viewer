import React from 'react';

interface LayoutPanelProps {
  mode: 'single'|'grid';
  setMode: (m: 'single'|'grid') => void;
}

export function LayoutPanel({ mode, setMode }: LayoutPanelProps) {
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      bottom: 10,
      transform: 'translateX(-50%)',
      background: 'white',
      border: '1px solid hsl(220, 13%, 91%)',
      borderRadius: 8,
      padding: 10,
      boxShadow: '0 4px 6px -1px hsl(220, 13%, 91%), 0 2px 4px -1px hsl(220, 13%, 91%)',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setMode('single')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: mode==='single'?'#eef':'#fff', cursor: 'pointer' }}>Single</button>
        <button onClick={() => setMode('grid')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: mode==='grid'?'#eef':'#fff', cursor: 'pointer' }}>Grid</button>
      </div>
    </div>
  );
}


