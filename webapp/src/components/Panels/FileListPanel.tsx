import React from 'react';
import type { StructureFormat } from '@types';

interface FileListPanelProps {
  files: Array<{ name: string; format: StructureFormat }>;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function FileListPanel({ files, currentIndex, onSelect }: FileListPanelProps) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid hsl(220, 13%, 91%)',
      borderRadius: 8,
      padding: 12,
      width: '100%',
      boxSizing: 'border-box',
      maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: '0 4px 6px -1px hsl(220, 13%, 91%), 0 2px 4px -1px hsl(220, 13%, 91%)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: 'hsl(220, 9%, 46%)' }}>Loaded Files</h3>
      </div>
      {files.length === 0 ? (
        <div style={{ color: '#666', fontSize: 12 }}>No files loaded.</div>
      ) : (
        <div>
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              onClick={() => onSelect(i)}
              title={f.name}
              style={{
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: 4,
                marginBottom: 6,
                background: i === currentIndex ? '#d1e7dd' : '#f0f0f0',
                borderLeft: i === currentIndex ? '3px solid #4CAF50' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'hsl(220, 9%, 30%)'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{
                marginLeft: 8,
                fontSize: 11,
                background: '#e0e0e0',
                padding: '1px 6px',
                borderRadius: 3
              }}>{f.format.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

