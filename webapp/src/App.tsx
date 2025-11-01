import React from 'react';
import { NanoProteinViewer } from '@components/NanoProteinViewer';
import type { StructureUrl } from '@types';

// Example: replace with your own URLs or wire from parent app/router
const exampleUrls: StructureUrl[] = [
    { name: '1CRN', url: 'https://files.rcsb.org/download/1CRN.pdb', format: 'pdb' },
    { name: '1CRN', url: 'https://files.rcsb.org/download/1CRN.pdb', format: 'pdb' }
];

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <NanoProteinViewer structureUrls={exampleUrls} />
    </div>
  );
}

