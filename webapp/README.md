# Nano Protein Viewer – React Webapp

A minimal React wrapper around Mol* to reuse the viewer/editor outside of the VS Code webview. It accepts a list of structure URLs and renders a file list + canvas viewer.

## Quick start

1. Install deps

```bash
npm install
npm run dev
```

2. Open `http://localhost:5173`.

## Passing structures by URL

Edit `src/App.tsx` and provide your own list:

```ts
import type { StructureUrl } from '@types';

const exampleUrls: StructureUrl[] = [
  { name: '1CRN', url: 'https://files.rcsb.org/download/1CRN.pdb', format: 'pdb' },
  { name: 'AF-P05067-F1', url: 'https://alphafold.ebi.ac.uk/files/AF-P05067-F1-model_v4.pdb', format: 'pdb' }
];
```

Or embed the component in another app:

```tsx
import { NanoProteinViewer } from '@components/NanoProteinViewer';

<NanoProteinViewer structureUrls={exampleUrls} />
```

## Notes

- This webapp lives in `webapp/` and is intentionally isolated from the VS Code extension TypeScript build.
- The component is a starting point. You can migrate features (color modes, surfaces, sequence alignment, grid view) from `src/index.html` incrementally into React components.

