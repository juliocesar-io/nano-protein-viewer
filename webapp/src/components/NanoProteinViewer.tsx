import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LoadedStructure, StructureFormat, StructureUrl } from '@types';
import { createMolstarViewer } from '@utils/molstar';
import { ControlsPanel } from './Panels/ControlsPanel';
import { GridView } from './Panels/GridView';
import { LayoutPanel } from './Panels/LayoutPanel';
import { FileListPanel } from './Panels/FileListPanel';

export interface NanoProteinViewerProps {
  structureUrls: StructureUrl[];
}

export function NanoProteinViewer({ structureUrls }: NanoProteinViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mol = useMemo(() => createMolstarViewer(), []);
  const [loaded, setLoaded] = useState<LoadedStructure[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Color controls
  const [colorMode, setColorMode] = useState<'custom'|'element'|'residue'|'secondary'|'chain'|'rainbow'>('custom');
  const [customColor, setCustomColor] = useState('#4ECDC4');
  const [secondaryColors, setSecondaryColors] = useState<{ helix: string; sheet: string; coil: string }>({ helix: '#0FA3FF', sheet: '#24B235', coil: '#E8E8E8' });
  const [rainbowPalette, setRainbowPalette] = useState<'rainbow'|'viridis'|'plasma'|'magma'|'blue-red'|'pastel'>('rainbow');
  const [detectedChains, setDetectedChains] = useState<string[]>([]);
  const [chainColors, setChainColors] = useState<Record<string,string>>({});
  const [illustrative, setIllustrative] = useState(false);
  const [surface, setSurface] = useState<{ enabled: boolean; opacity: number; inherit: boolean; customColor: string }>({ enabled: false, opacity: 40, inherit: true, customColor: '#4ECDC4' });
  const [layoutMode, setLayoutMode] = useState<'single'|'grid'>('single');

  type ViewerSettings = {
    colorMode: typeof colorMode;
    customColor: string;
    secondaryColors: { helix: string; sheet: string; coil: string };
    rainbowPalette: typeof rainbowPalette;
    chainColors: Record<string,string>;
    illustrative: boolean;
    surface: { enabled: boolean; opacity: number; inherit: boolean; customColor: string };
  };
  const [settingsByFile, setSettingsByFile] = useState<Record<string, ViewerSettings>>({});
  const getDefaultSettings = (): ViewerSettings => ({
    colorMode, customColor, secondaryColors, rainbowPalette, chainColors, illustrative, surface
  });
  const getKey = (idx: number) => loaded[idx]?.name || String(idx);

  const detectFormat = (nameOrUrl: string, explicit?: StructureFormat): StructureFormat => {
    if (explicit) return explicit;
    const l = nameOrUrl.toLowerCase();
    if (l.endsWith('.cif') || l.endsWith('.mmcif')) return 'mmcif';
    if (l.endsWith('.sdf')) return 'sdf';
    return 'pdb';
  };

  const fetchAndLoad = useCallback(async (entry: StructureUrl) => {
    const res = await fetch(entry.url);
    if (!res.ok) throw new Error(`Failed to fetch ${entry.url}`);
    const text = await res.text();
    const format = detectFormat(entry.name || entry.url, entry.format);
    return { name: entry.name, data: text, format } as LoadedStructure;
  }, []);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      const container = containerRef.current;
      if (!container) return;
      await mol.mount(container);

      if (structureUrls && structureUrls.length) {
        try {
          const results = await Promise.all(structureUrls.map(fetchAndLoad));
          if (isCancelled) return;
          setLoaded(results);
          setCurrentIndex(results.length > 0 ? 0 : -1);
          if (results.length > 0) {
            await mol.loadStructureText(results[0].data, results[0].format);
            // detect chains and init defaults
            const chains = await mol.listChains();
            setDetectedChains(chains);
            if (chains.length) {
              const defaults = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2','#F8B4B4','#52B788'];
              const cc: Record<string,string> = {};
              chains.forEach((c, i) => { cc[c] = defaults[i % defaults.length]; });
              setChainColors(cc);
            }
            // init settings for first file if missing
            const key = results[0].name;
            setSettingsByFile(prev => prev[key] ? prev : ({ ...prev, [key]: getDefaultSettings() }));
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
    })();
    return () => { isCancelled = true; };
  }, [fetchAndLoad, mol, structureUrls]);

  const onSelectIndex = useCallback(async (idx: number) => {
    if (idx < 0 || idx >= loaded.length) return;

    // Persist settings of current file before switching
    if (currentIndex >= 0 && currentIndex < loaded.length) {
      const currentKey = getKey(currentIndex);
      setSettingsByFile(prev => ({
        ...prev,
        [currentKey]: { colorMode, customColor, secondaryColors, rainbowPalette, chainColors, illustrative, surface }
      }));
    }

    setCurrentIndex(idx);
    await mol.loadStructureText(loaded[idx].data, loaded[idx].format, false);

    // Update detected chains for the newly loaded structure
    const chains = await mol.listChains();
    setDetectedChains(chains);

    // Restore saved settings for the new file if present
    const key = getKey(idx);
    const saved = settingsByFile[key];
    if (saved) {
      setColorMode(saved.colorMode);
      setCustomColor(saved.customColor);
      setSecondaryColors(saved.secondaryColors);
      setRainbowPalette(saved.rainbowPalette);
      setChainColors(saved.chainColors);
      setIllustrative(saved.illustrative);
      setSurface(saved.surface);
    } else {
      // Initialize defaults for this file
      setSettingsByFile(prev => ({ ...prev, [key]: getDefaultSettings() }));
    }
  }, [chainColors, colorMode, currentIndex, customColor, getDefaultSettings, getKey, illustrative, loaded, mol, rainbowPalette, secondaryColors, settingsByFile, surface]);

  // When current file changes, restore its saved settings (or initialize from current defaults)
  useEffect(() => {
    (async () => {
      if (currentIndex < 0 || currentIndex >= loaded.length) return;
      const key = getKey(currentIndex);
      const saved = settingsByFile[key];
      if (saved) {
        setColorMode(saved.colorMode);
        setCustomColor(saved.customColor);
        setSecondaryColors(saved.secondaryColors);
        setRainbowPalette(saved.rainbowPalette);
        setChainColors(saved.chainColors);
        setIllustrative(saved.illustrative);
        setSurface(saved.surface);
      } else {
        setSettingsByFile(prev => ({ ...prev, [key]: getDefaultSettings() }));
      }
    })();
  }, [currentIndex, loaded.length]);

  // Apply color theme when controls change
  useEffect(() => {
    (async () => {
      if (!loaded.length) return;
      if (colorMode === 'custom') {
        await mol.updateColorTheme('custom', { hex: customColor });
      } else if (colorMode === 'secondary') {
        await mol.updateColorTheme('secondary', { secondaryColors });
      } else if (colorMode === 'element') {
        await mol.updateColorTheme('element');
      } else if (colorMode === 'residue') {
        await mol.updateColorTheme('residue');
      } else if (colorMode === 'chain') {
        await mol.updateColorTheme('chain', { chainColors });
      } else if (colorMode === 'rainbow') {
        await mol.updateColorTheme('rainbow', { palette: rainbowPalette });
      }
    })();
  }, [colorMode, customColor, secondaryColors, rainbowPalette, chainColors, currentIndex, loaded.length, mol]);

  // Apply illustrative/surface when toggled
  useEffect(() => { (async () => { await mol.applyIllustrativeStyle(illustrative); })(); }, [illustrative, currentIndex, mol]);
  useEffect(() => { (async () => { await mol.applySurface(surface.enabled, { opacity: surface.opacity, inherit: surface.inherit, customColor: surface.customColor }); })(); }, [surface.enabled, surface.opacity, surface.inherit, surface.customColor, currentIndex, mol]);

  // Persist settings per file whenever controls change
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= loaded.length) return;
    const key = getKey(currentIndex);
    setSettingsByFile(prev => ({
      ...prev,
      [key]: {
        colorMode, customColor, secondaryColors, rainbowPalette, chainColors, illustrative, surface
      }
    }));
  }, [colorMode, customColor, secondaryColors, rainbowPalette, chainColors, illustrative, surface, currentIndex, loaded.length]);

  // Ensure main viewer is mounted and shows current structure when switching back to single layout
  useEffect(() => {
    (async () => {
      if (layoutMode !== 'single') return;
      const el = containerRef.current;
      if (!el) return;
      await mol.mount(el);
      const current = loaded[currentIndex] ?? loaded[0];
      if (current) {
        await mol.loadStructureText(current.data, current.format, false);
      }
    })();
  }, [layoutMode, currentIndex, loaded, mol]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {layoutMode === 'single' && (
        <div style={{ position: 'absolute', inset: 0 }} ref={containerRef} />
      )}
      {layoutMode === 'grid' && (
        <GridView files={loaded} onSelect={(i) => { onSelectIndex(i); }} />
      )}

      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, width: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {layoutMode === 'single' && (
          <ControlsPanel
            colorMode={colorMode}
            setColorMode={setColorMode}
            customColor={customColor}
            setCustomColor={setCustomColor}
            secondaryColors={secondaryColors}
            setSecondaryColors={setSecondaryColors}
            // Rainbow
            rainbowPalette={rainbowPalette}
            setRainbowPalette={setRainbowPalette}
            // Chain
            detectedChains={detectedChains}
            chainColors={chainColors}
            setChainColor={(id, hex) => setChainColors(prev => ({ ...prev, [id]: hex }))}
            // Style
            illustrative={illustrative}
            onToggleIllustrative={setIllustrative}
            surface={surface}
            setSurface={setSurface}
            onResetView={async () => { await mol.resetView(); }}
          />
        )}

        <div>
          <FileListPanel
            files={loaded.map((f) => ({ name: f.name, format: f.format }))}
            currentIndex={currentIndex}
            onSelect={onSelectIndex}
          />
        </div>
      </div>

      <LayoutPanel mode={layoutMode} setMode={setLayoutMode} />
    </div>
  );
}

