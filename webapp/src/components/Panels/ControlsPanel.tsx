import React, { useMemo, useState } from 'react';

type ColorMode = 'none'|'custom'|'element'|'residue'|'secondary'|'chain'|'rainbow';

interface ControlsPanelProps {
  colorMode: ColorMode;
  setColorMode: (m: ColorMode) => void;
  customColor: string;
  setCustomColor: (hex: string) => void;
  secondaryColors: { helix: string; sheet: string; coil: string };
  setSecondaryColors: (c: { helix: string; sheet: string; coil: string }) => void;
  rainbowPalette?: 'rainbow'|'viridis'|'plasma'|'magma'|'blue-red'|'pastel';
  setRainbowPalette?: (p: 'rainbow'|'viridis'|'plasma'|'magma'|'blue-red'|'pastel') => void;
  detectedChains?: string[];
  chainColors?: Record<string,string>;
  setChainColor?: (chainId: string, hex: string) => void;
  illustrative?: boolean;
  onToggleIllustrative?: (v: boolean) => void;
  surface?: { enabled: boolean; opacity: number; inherit: boolean; customColor: string };
  setSurface?: (s: { enabled: boolean; opacity: number; inherit: boolean; customColor: string }) => void;
  onResetView?: () => void;
  // layout controls removed; handled by separate LayoutPanel
}

export function ControlsPanel(props: ControlsPanelProps) {
  const [open, setOpen] = useState(false);
  const palette = useMemo(() => [
    '#4ECDC4','#FF6B6B','#4DABF7','#69DB7C','#FFD93D',
    '#FF922B','#DA77F2','#FF8CC8','#15AABF','#868E96'
  ], []);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: 12,
      padding: 12,
      boxShadow: '0 8px 32px rgba(31,38,135,0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 16, color: 'hsl(220, 9%, 46%)' }}>Controls</h3>
      </div>

      {props.onResetView && (
        <div style={{ marginTop: 8 }}>
          <button onClick={props.onResetView} style={{
            padding: '8px 12px', width: '100%', borderRadius: 6, border: '1px solid hsl(214.3 31.8% 91.4%)',
            background: 'hsl(220, 9%, 46%)', color: 'hsl(210,40%,98%)', cursor: 'pointer'
          }}>Reset View</button>
        </div>
      )}

      {/* layout controls handled elsewhere */}

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'hsl(220, 9%, 46%)' }}>Colors</h4>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(o => !o)} style={{
            background: '#fff', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: 6, padding: '6px 12px',
            fontSize: 12, color: 'hsl(220, 9%, 46%)', cursor: 'pointer'
          }}>
            {props.colorMode === 'none' ? 'Select' : (props.colorMode === 'rainbow' ? 'Rainbow' : props.colorMode.charAt(0).toUpperCase()+props.colorMode.slice(1))} ▼
          </button>
          {open && (
            <div style={{ position: 'absolute', background: '#fff', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: 6, marginTop: 4, zIndex: 20, width: 200 }}>
              {(['none','custom','element','residue','secondary','chain','rainbow'] as ColorMode[]).map(m => (
                <div key={m} onClick={() => { props.setColorMode(m); setOpen(false); }}
                  style={{ padding: '8px 12px', fontSize: 12, cursor: 'pointer', color: 'hsl(220, 9%, 46%)', background: props.colorMode===m?'hsl(220, 9%, 96%)':'#fff' }}>
                  {m === 'none' ? 'None' : m.charAt(0).toUpperCase()+m.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        {props.colorMode === 'custom' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {palette.map(hex => (
                <div key={hex} title={hex} onClick={() => props.setCustomColor(hex)}
                  style={{ width: 28, height: 28, borderRadius: 4, background: hex, border: props.customColor===hex? '3px solid #111':'2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
        )}

        {props.colorMode === 'secondary' && (
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            <label style={{ fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>Helix <input type="color" value={props.secondaryColors.helix} onChange={(e) => props.setSecondaryColors({ ...props.secondaryColors, helix: e.target.value })} style={{ marginLeft: 8 }} /></label>
            <label style={{ fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>Sheet <input type="color" value={props.secondaryColors.sheet} onChange={(e) => props.setSecondaryColors({ ...props.secondaryColors, sheet: e.target.value })} style={{ marginLeft: 8 }} /></label>
            <label style={{ fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>Coil <input type="color" value={props.secondaryColors.coil} onChange={(e) => props.setSecondaryColors({ ...props.secondaryColors, coil: e.target.value })} style={{ marginLeft: 8 }} /></label>
          </div>
        )}

        {props.colorMode === 'rainbow' && props.setRainbowPalette && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              {(['rainbow','viridis','plasma','magma','blue-red','pastel'] as const).map(p => (
                <button key={p} onClick={() => props.setRainbowPalette!(p)}
                  style={{ padding: '6px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #ddd', background: props.rainbowPalette===p?'#eef':'#fff', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {props.colorMode === 'chain' && props.detectedChains && props.chainColors && props.setChainColor && (
          <div style={{ marginTop: 10 }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'hsl(220, 9%, 46%)' }}>Customize Chain Colors</h4>
            <div style={{ display: 'grid', gap: 6 }}>
              {props.detectedChains.map(id => (
                <label key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>
                  <span>Chain {id}</span>
                  <input type="color" value={props.chainColors![id] || '#4ECDC4'} onChange={(e) => props.setChainColor!(id, e.target.value)} />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'hsl(220, 9%, 46%)' }}>Style</h4>
        {typeof props.illustrative === 'boolean' && props.onToggleIllustrative && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>
            <input type="checkbox" checked={props.illustrative} onChange={(e) => props.onToggleIllustrative!(e.target.checked)} /> Illustrative
          </label>
        )}
        {props.surface && props.setSurface && (
          <div style={{ marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>
              <input type="checkbox" checked={props.surface.enabled} onChange={(e) => props.setSurface!({ ...props.surface, enabled: e.target.checked })} /> Surface
            </label>
            {props.surface.enabled && (
              <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                <label style={{ fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>Opacity
                  <input type="range" min={0} max={100} value={props.surface.opacity} onChange={(e) => props.setSurface!({ ...props.surface, opacity: parseInt(e.target.value) })} style={{ width: '100%', marginTop: 4 }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>
                  <input type="checkbox" checked={props.surface.inherit} onChange={(e) => props.setSurface!({ ...props.surface, inherit: e.target.checked })} /> Inherit color from theme
                </label>
                {!props.surface.inherit && (
                  <label style={{ fontSize: 12, color: 'hsl(220, 9%, 46%)' }}>Surface Color
                    <input type="color" value={props.surface.customColor} onChange={(e) => props.setSurface!({ ...props.surface, customColor: e.target.value })} style={{ marginLeft: 8 }} />
                  </label>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

