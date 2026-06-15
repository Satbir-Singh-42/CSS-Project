import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function ShadowGenerator({ shadows, onChange }) {
  const addShadow = () => {
    onChange([...shadows, { x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false }]);
  };

  const removeShadow = (index) => {
    if (shadows.length <= 1) return;
    onChange(shadows.filter((_, i) => i !== index));
  };

  const updateShadow = (index, field, value) => {
    const newShadows = [...shadows];
    newShadows[index] = { ...newShadows[index], [field]: value };
    onChange(newShadows);
  };

  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeShadow = shadows[activeIndex];

  return (
    <div className="tool-panel">
      <div className="control-group">
        <div className="control-header">
          <span className="control-label">Shadow Layers</span>
          <button className="btn btn-outline" onClick={addShadow}>
            <Plus size={16} /> Add Layer
          </button>
        </div>
        <div className="layer-list">
          {shadows.map((s, i) => (
            <div
              key={i}
              className={`layer-item ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="layer-info">
                <GripVertical size={16} style={{ opacity: 0.5 }} />
                <div
                  className="color-swatch"
                  style={{ backgroundColor: s.color, opacity: s.opacity }}
                />
                <span className="control-label" style={{ fontSize: '0.875rem' }}>
                  {s.inset ? 'Inset ' : ''}Layer {i + 1}
                </span>
              </div>
              <button
                className="btn-icon btn-danger"
                onClick={(e) => { e.stopPropagation(); removeShadow(i); if (activeIndex >= shadows.length - 1) setActiveIndex(Math.max(0, shadows.length - 2)); }}
                disabled={shadows.length <= 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />

      {activeShadow && (
        <>
          <div className="control-group">
            <label className="flex-row">
              <input
                type="checkbox"
                checked={activeShadow.inset}
                onChange={(e) => updateShadow(activeIndex, 'inset', e.target.checked)}
              />
              <span className="control-label">Inset (Inner Shadow)</span>
            </label>
          </div>

          <div className="control-group">
            <div className="control-header">
              <span className="control-label">X Offset</span>
              <span className="control-value">{activeShadow.x}px</span>
            </div>
            <input type="range" min="-50" max="50" value={activeShadow.x} onChange={(e) => updateShadow(activeIndex, 'x', Number(e.target.value))} />
          </div>

          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Y Offset</span>
              <span className="control-value">{activeShadow.y}px</span>
            </div>
            <input type="range" min="-50" max="50" value={activeShadow.y} onChange={(e) => updateShadow(activeIndex, 'y', Number(e.target.value))} />
          </div>

          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Blur Radius</span>
              <span className="control-value">{activeShadow.blur}px</span>
            </div>
            <input type="range" min="0" max="100" value={activeShadow.blur} onChange={(e) => updateShadow(activeIndex, 'blur', Number(e.target.value))} />
          </div>

          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Spread Radius</span>
              <span className="control-value">{activeShadow.spread}px</span>
            </div>
            <input type="range" min="-50" max="50" value={activeShadow.spread} onChange={(e) => updateShadow(activeIndex, 'spread', Number(e.target.value))} />
          </div>

          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Color</span>
              <input type="color" className="color-picker-input" value={activeShadow.color} onChange={(e) => updateShadow(activeIndex, 'color', e.target.value)} />
            </div>
          </div>

          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Opacity</span>
              <span className="control-value">{activeShadow.opacity}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={activeShadow.opacity} onChange={(e) => updateShadow(activeIndex, 'opacity', Number(e.target.value))} />
          </div>
        </>
      )}
    </div>
  );
}
