import React from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

const PRESETS = [
  { label: 'Sunset', stops: [{ color: '#f97316', position: 0 }, { color: '#ec4899', position: 50 }, { color: '#8b5cf6', position: 100 }], angle: 135, type: 'linear' },
  { label: 'Ocean', stops: [{ color: '#06b6d4', position: 0 }, { color: '#3b82f6', position: 50 }, { color: '#6366f1', position: 100 }], angle: 120, type: 'linear' },
  { label: 'Forest', stops: [{ color: '#10b981', position: 0 }, { color: '#059669', position: 50 }, { color: '#065f46', position: 100 }], angle: 160, type: 'linear' },
  { label: 'Fire', stops: [{ color: '#fbbf24', position: 0 }, { color: '#f97316', position: 50 }, { color: '#ef4444', position: 100 }], angle: 45, type: 'linear' },
  { label: 'Aurora', stops: [{ color: '#4ade80', position: 0 }, { color: '#06b6d4', position: 50 }, { color: '#818cf8', position: 100 }], angle: 105, type: 'linear' },
  { label: 'Radial', stops: [{ color: '#f9a8d4', position: 0 }, { color: '#6366f1', position: 100 }], angle: 0, type: 'radial' },
];

export default function GradientGenerator({ config, onChange }) {
  const handleStopChange = (index, field, value) => {
    const newStops = [...config.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    onChange({ ...config, stops: newStops });
  };

  const addStop = () => {
    if (config.stops.length >= 10) return;
    const sorted = [...config.stops].sort((a, b) => a.position - b.position);
    const last = sorted[sorted.length - 1];
    const newPos = Math.min(100, last.position + Math.round((100 - last.position) / 2));
    onChange({ ...config, stops: [...config.stops, { color: '#ffffff', position: newPos }] });
  };

  const removeStop = (index) => {
    if (config.stops.length <= 2) return;
    onChange({ ...config, stops: config.stops.filter((_, i) => i !== index) });
  };

  const applyPreset = (preset) => {
    onChange({ ...config, ...preset });
  };

  return (
    <div className="gg-root">
      {/* Preset chips */}
      <div className="gg-section-label">Presets</div>
      <div className="gg-presets">
        {PRESETS.map((p) => {
          const stopStr = p.stops.map(s => `${s.color} ${s.position}%`).join(', ');
          const bg = p.type === 'linear'
            ? `linear-gradient(${p.angle}deg, ${stopStr})`
            : `radial-gradient(circle, ${stopStr})`;
          return (
            <button key={p.label} className="gg-preset-chip" style={{ background: bg }} onClick={() => applyPreset(p)}>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="gg-divider" />

      {/* Type toggle */}
      <div className="gg-section-label">Type</div>
      <div className="segmented-control">
        <button className={`segmented-btn ${config.type === 'linear' ? 'active' : ''}`} onClick={() => onChange({ ...config, type: 'linear' })}>
          Linear
        </button>
        <button className={`segmented-btn ${config.type === 'radial' ? 'active' : ''}`} onClick={() => onChange({ ...config, type: 'radial' })}>
          Radial
        </button>
      </div>

      {/* Angle slider (linear only) */}
      {config.type === 'linear' && (
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
            onChange={(e) => onChange({ ...config, angle: Number(e.target.value) })} />
        </div>
      )}

      {/* Color stops */}
      <div className="gg-section-label" style={{ marginTop: '0.5rem' }}>
        Color Stops
        <button className="gg-add-stop-btn" onClick={addStop} disabled={config.stops.length >= 10}>
          <Plus size={13} /> Add Stop
        </button>
      </div>

      <div className="gg-stops-list">
        {[...config.stops]
          .map((stop, originalIndex) => ({ stop, originalIndex }))
          .sort((a, b) => a.stop.position - b.stop.position)
          .map(({ stop, originalIndex }) => (
            <div key={originalIndex} className="gg-stop-row">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => handleStopChange(originalIndex, 'color', e.target.value)}
                className="gg-color-input"
                title="Pick color"
              />
              <div className="gg-stop-track-wrap">
                <input
                  type="range" min="0" max="100"
                  value={stop.position}
                  onChange={(e) => handleStopChange(originalIndex, 'position', Number(e.target.value))}
                  className="gg-stop-slider"
                />
              </div>
              <span className="gg-stop-pos">{stop.position}%</span>
              <button
                className="btn-icon btn-danger"
                onClick={() => removeStop(originalIndex)}
                disabled={config.stops.length <= 2}
                title="Remove stop"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
