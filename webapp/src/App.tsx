import React from 'react';
import { NanoProteinViewer } from '@components/NanoProteinViewer';
import type { StructureUrl } from '@types';

// Example: replace with your own URLs or wire from parent app/router
const exampleUrls: StructureUrl[] = [
    { name: '1CRN', url: 'https://files.rcsb.org/download/1CRN.pdb', format: 'pdb' },
    { name: 'AF-A0A2K6V5L6-F1', url: 'https://alphafold.ebi.ac.uk/files/AF-A0A2K6V5L6-F1-model_v6.cif', format: 'mmcif' as StructureFormat }
];

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <NanoProteinViewer structureUrls={exampleUrls} />
    </div>
  );
}

