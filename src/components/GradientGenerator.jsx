import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

let _nextId = 100;
const nextId = () => ++_nextId;
const withIds = (stops) => stops.map(s => ({ ...s, id: nextId() }));

// ─── Preset Library ──────────────────────────────────────────────────────────
const PRESETS = {
  linear: [
    { label: 'Sunset',    stops: [{ color: '#f97316', position: 0 }, { color: '#ec4899', position: 50 }, { color: '#8b5cf6', position: 100 }], angle: 135 },
    { label: 'Ocean',     stops: [{ color: '#06b6d4', position: 0 }, { color: '#3b82f6', position: 50 }, { color: '#6366f1', position: 100 }], angle: 120 },
    { label: 'Forest',    stops: [{ color: '#10b981', position: 0 }, { color: '#059669', position: 50 }, { color: '#065f46', position: 100 }], angle: 160 },
    { label: 'Fire',      stops: [{ color: '#fbbf24', position: 0 }, { color: '#f97316', position: 50 }, { color: '#ef4444', position: 100 }], angle: 45  },
    { label: 'Aurora',    stops: [{ color: '#4ade80', position: 0 }, { color: '#06b6d4', position: 50 }, { color: '#818cf8', position: 100 }], angle: 105 },
    { label: 'Cotton',    stops: [{ color: '#f9a8d4', position: 0 }, { color: '#a78bfa', position: 50 }, { color: '#60a5fa', position: 100 }], angle: 135 },
    { label: 'Peach',     stops: [{ color: '#fde68a', position: 0 }, { color: '#fb923c', position: 55 }, { color: '#f43f5e', position: 100 }], angle: 150 },
    { label: 'Midnight',  stops: [{ color: '#1e1b4b', position: 0 }, { color: '#312e81', position: 50 }, { color: '#4f46e5', position: 100 }], angle: 135 },
    { label: 'Neon',      stops: [{ color: '#f0abfc', position: 0 }, { color: '#22d3ee', position: 50 }, { color: '#86efac', position: 100 }], angle: 90  },
    { label: 'Rose Gold', stops: [{ color: '#fca5a5', position: 0 }, { color: '#f472b6', position: 50 }, { color: '#a78bfa', position: 100 }], angle: 120 },
    { label: 'Lime',      stops: [{ color: '#d9f99d', position: 0 }, { color: '#4ade80', position: 50 }, { color: '#0d9488', position: 100 }], angle: 135 },
    { label: 'Candy',     stops: [{ color: '#fb7185', position: 0 }, { color: '#fbbf24', position: 33 }, { color: '#34d399', position: 66 }, { color: '#60a5fa', position: 100 }], angle: 90 },
  ],
  radial: [
    { label: 'Bloom',    stops: [{ color: '#f9a8d4', position: 0 }, { color: '#6366f1', position: 100 }] },
    { label: 'Solar',    stops: [{ color: '#fef08a', position: 0 }, { color: '#f97316', position: 60 }, { color: '#dc2626', position: 100 }] },
    { label: 'Deep Sea', stops: [{ color: '#67e8f9', position: 0 }, { color: '#1d4ed8', position: 55 }, { color: '#0f172a', position: 100 }] },
    { label: 'Galaxy',   stops: [{ color: '#e879f9', position: 0 }, { color: '#6366f1', position: 40 }, { color: '#0f172a', position: 100 }] },
    { label: 'Halo',     stops: [{ color: '#ffffff', position: 0 }, { color: '#93c5fd', position: 40 }, { color: '#1e3a8a', position: 100 }] },
    { label: 'Lava',     stops: [{ color: '#fde68a', position: 0 }, { color: '#ef4444', position: 50 }, { color: '#1c1917', position: 100 }] },
    { label: 'Mint',     stops: [{ color: '#d1fae5', position: 0 }, { color: '#059669', position: 100 }] },
    { label: 'Dusk',     stops: [{ color: '#fde68a', position: 0 }, { color: '#f472b6', position: 45 }, { color: '#312e81', position: 100 }] },
  ],
  conic: [
    { label: 'Rainbow',    stops: [{ color: '#f43f5e', position: 0 }, { color: '#f97316', position: 17 }, { color: '#fbbf24', position: 33 }, { color: '#4ade80', position: 50 }, { color: '#22d3ee', position: 67 }, { color: '#818cf8', position: 83 }, { color: '#f43f5e', position: 100 }] },
    { label: 'Pie',        stops: [{ color: '#6366f1', position: 0 }, { color: '#6366f1', position: 33 }, { color: '#f43f5e', position: 33 }, { color: '#f43f5e', position: 66 }, { color: '#fbbf24', position: 66 }, { color: '#fbbf24', position: 100 }] },
    { label: 'Spin',       stops: [{ color: '#06b6d4', position: 0 }, { color: '#8b5cf6', position: 50 }, { color: '#06b6d4', position: 100 }] },
    { label: 'Fire Wheel', stops: [{ color: '#fde68a', position: 0 }, { color: '#f97316', position: 40 }, { color: '#dc2626', position: 70 }, { color: '#fde68a', position: 100 }] },
    { label: 'Hue',        stops: [{ color: '#f43f5e', position: 0 }, { color: '#a855f7', position: 25 }, { color: '#3b82f6', position: 50 }, { color: '#10b981', position: 75 }, { color: '#f43f5e', position: 100 }] },
    { label: 'Pastel',     stops: [{ color: '#fca5a5', position: 0 }, { color: '#fde68a', position: 25 }, { color: '#a7f3d0', position: 50 }, { color: '#bfdbfe', position: 75 }, { color: '#fca5a5', position: 100 }] },
  ],
};

function presetBg(type, p) {
  const s = p.stops.map(x => `${x.color} ${x.position}%`).join(', ');
  if (type === 'linear') return `linear-gradient(${p.angle ?? 135}deg, ${s})`;
  if (type === 'conic')  return `conic-gradient(${s})`;
  return `radial-gradient(circle, ${s})`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function GradientGenerator({ config, onChange }) {
  const [selectedId, setSelectedId] = useState(config.stops[1]?.id ?? config.stops[0]?.id);
  const trackRef   = useRef(null);
  const draggingRef = useRef(null);

  const selectedStop = config.stops.find(s => s.id === selectedId) ?? config.stops[0];

  const updateStop = useCallback((id, field, value) => {
    onChange({ ...config, stops: config.stops.map(s => s.id === id ? { ...s, [field]: value } : s) });
  }, [config, onChange]);

  const addStop = () => {
    if (config.stops.length >= 10) return;
    const sorted = [...config.stops].sort((a, b) => a.position - b.position);
    let bestPos = 50, bestGap = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].position - sorted[i].position;
      if (gap > bestGap) { bestGap = gap; bestPos = Math.round((sorted[i].position + sorted[i + 1].position) / 2); }
    }
    const s = { id: nextId(), color: '#ffffff', position: bestPos };
    onChange({ ...config, stops: [...config.stops, s] });
    setSelectedId(s.id);
  };

  const removeStop = (id) => {
    if (config.stops.length <= 2) return;
    const rest = config.stops.filter(s => s.id !== id);
    onChange({ ...config, stops: rest });
    setSelectedId(rest[0].id);
  };

  const applyPreset = (type, p) => {
    const stopsWithIds = withIds(p.stops);
    onChange({ ...config, type, angle: p.angle ?? 0, stops: stopsWithIds });
    setSelectedId(stopsWithIds[0].id);
  };

  // Drag
  const handleMouseDown = useCallback((e, id) => {
    e.preventDefault();
    setSelectedId(id);
    draggingRef.current = id;
    const onMove = (ev) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct  = Math.round(Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100)));
      updateStop(draggingRef.current, 'position', pct);
    };
    const onUp = () => { draggingRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [updateStop]);

  const handleTouchStart = useCallback((e, id) => {
    setSelectedId(id);
    draggingRef.current = id;
    const onMove = (ev) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct  = Math.round(Math.min(100, Math.max(0, ((ev.touches[0].clientX - rect.left) / rect.width) * 100)));
      updateStop(draggingRef.current, 'position', pct);
    };
    const onEnd = () => { draggingRef.current = null; window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }, [updateStop]);

  const sorted   = [...config.stops].sort((a, b) => a.position - b.position);
  const trackGrad = `linear-gradient(to right, ${sorted.map(s => `${s.color} ${s.position}%`).join(', ')})`;

  const TYPE_TABS = ['linear', 'radial', 'conic'];

  return (
    <div className="gg-root">

      {/* ── Type Tabs ── */}
      <div className="gg-type-tabs">
        {TYPE_TABS.map(t => (
          <button
            key={t}
            className={`gg-type-tab ${config.type === t ? 'active' : ''}`}
            onClick={() => onChange({ ...config, type: t })}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Preset Swatches Grid ── */}
      <div className="gg-preset-grid">
        {(PRESETS[config.type] ?? []).map(p => (
          <button
            key={p.label}
            className="gg-swatch"
            style={{ background: presetBg(config.type, p) }}
            onClick={() => applyPreset(config.type, p)}
            title={p.label}
          >
            <span className="gg-swatch-label">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="gg-divider" />

      {/* ── Angle (linear & conic) ── */}
      {(config.type === 'linear' || config.type === 'conic') && (
        <div className="gg-control">
          <div className="gg-control-header">
            <span className="gg-label">Angle</span>
            <div className="gg-angle-display">
              <span className="gg-value">{config.angle}°</span>
              <button className="gg-angle-btn" onClick={() => onChange({ ...config, angle: (config.angle + 45) % 360 })} title="Rotate 45°">
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
          <input type="range" min="0" max="360" value={config.angle}
            onChange={e => onChange({ ...config, angle: Number(e.target.value) })} />
        </div>
      )}

      {/* ── Color Stops Label ── */}
      <div className="gg-section-label" style={{ marginTop: '0.25rem' }}>
        Color Stops
        <button className="gg-add-stop-btn" onClick={addStop} disabled={config.stops.length >= 10}>
          <Plus size={13} /> Add Stop
        </button>
      </div>

      {/* ── Unified Gradient Track ── */}
      <div className="gg-unified-track-wrap">
        <div className="gg-unified-track" ref={trackRef} style={{ background: trackGrad }}>
          {sorted.map(stop => (
            <div
              key={stop.id}
              className={`gg-stop-handle ${stop.id === selectedId ? 'selected' : ''}`}
              style={{ left: `${stop.position}%`, background: stop.color }}
              onMouseDown={e => handleMouseDown(e, stop.id)}
              onTouchStart={e => handleTouchStart(e, stop.id)}
              title={`${stop.position}%`}
            >
              <span className="gg-handle-tick" />
            </div>
          ))}
        </div>
        <div className="gg-track-labels">
          {sorted.map(stop => (
            <div key={stop.id}
              className={`gg-track-label ${stop.id === selectedId ? 'selected' : ''}`}
              style={{ left: `${stop.position}%` }}>
              {stop.position}%
            </div>
          ))}
        </div>
      </div>

      {/* ── Selected Stop Row ── */}
      {selectedStop && (
        <div className="gg-selected-stop">
          <input
            type="color"
            value={selectedStop.color}
            onChange={e => updateStop(selectedStop.id, 'color', e.target.value)}
            className="gg-color-input"
            title="Pick color"
          />
          <div className="gg-selected-stop-info">
            <span className="gg-label">Selected stop</span>
            <span className="gg-value" style={{ color: selectedStop.color }}>
              {selectedStop.color.toUpperCase()} · {selectedStop.position}%
            </span>
          </div>
          <button
            className="btn-icon btn-danger"
            onClick={() => removeStop(selectedStop.id)}
            disabled={config.stops.length <= 2}
            title="Remove stop"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
