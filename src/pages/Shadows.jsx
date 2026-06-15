import React, { useState } from 'react';
import ShadowGenerator from '../components/ShadowGenerator';
import Preview from '../components/Preview';
import CodeOutput from '../components/CodeOutput';

export default function Shadows() {
  const [shadows, setShadows] = useState([
    { x: 0, y: 20, blur: 40, spread: -10, color: '#6366f1', opacity: 0.3, inset: false },
    { x: 0, y: 4,  blur: 12, spread: -2,  color: '#000000', opacity: 0.08, inset: false },
  ]);

  const [bgColor, setBgColor] = useState('#f1f5f9');
  const [shape, setShape] = useState('rounded');

  const shapeRadius = { square: '8px', rounded: '20px', pill: '9999px', circle: '50%' };

  return (
    <div className="shadow-page">
      {/* Left: Controls */}
      <div className="shadow-controls-panel">
        <div className="shadow-panel-header">
          <div>
            <h2>Shadow Studio</h2>
            <p>Layer multiple box-shadows for rich depth effects.</p>
          </div>
        </div>

        <div className="shadow-panel-body">
          {/* Shape selector */}
          <div className="sp-section">
            <div className="sp-section-label">Preview Shape</div>
            <div className="sp-shape-row">
              {Object.keys(shapeRadius).map(s => (
                <button
                  key={s}
                  className={`sp-shape-btn ${shape === s ? 'active' : ''}`}
                  onClick={() => setShape(s)}
                >
                  <span className="sp-shape-icon" style={{ borderRadius: shapeRadius[s], width: s === 'pill' ? '32px' : undefined }} />
                  <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BG color */}
          <div className="sp-section">
            <div className="sp-section-label">Canvas Color</div>
            <div className="sp-bg-row">
              {['#ffffff', '#f1f5f9', '#1e293b', '#0f172a', '#fdf4ff', '#ecfdf5'].map(c => (
                <button
                  key={c}
                  className={`sp-bg-swatch ${bgColor === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setBgColor(c)}
                  title={c}
                />
              ))}
              <label className="sp-bg-custom-wrap" title="Custom color">
                <input
                  type="color"
                  className="sp-bg-custom-input"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="sp-divider" />

          <ShadowGenerator shadows={shadows} onChange={setShadows} />
        </div>
      </div>

      {/* Right: Preview + Code */}
      <div className="shadow-preview-panel">
        <div className="shadow-preview-canvas" style={{ background: bgColor }}>
          <div
            className="shadow-preview-box"
            style={{
              boxShadow: shadows
                .map(s => {
                  const r = parseInt(s.color.slice(1, 3), 16) || 0;
                  const g = parseInt(s.color.slice(3, 5), 16) || 0;
                  const b = parseInt(s.color.slice(5, 7), 16) || 0;
                  return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px rgba(${r},${g},${b},${s.opacity})`;
                }).join(', '),
              borderRadius: shapeRadius[shape],
              width: shape === 'pill' ? '280px' : '180px',
              height: shape === 'pill' ? '120px' : '180px',
            }}
          />
        </div>

        <div className="shadow-code-section">
          <CodeOutput
            gradientConfig={{ type: 'linear', angle: 0, stops: [{ color: '#ffffff', position: 0 }, { color: '#ffffff', position: 100 }] }}
            shadows={shadows}
          />
        </div>
      </div>
    </div>
  );
}
