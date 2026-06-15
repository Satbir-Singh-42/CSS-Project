import React, { useState, useEffect } from 'react';

// Helpers
function hexToRGB(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function rgbToHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return {h, s, l};
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2, r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return rgbToHex(r, g, b);
}

// Mix color with black or white. Percentage is 0-1 (0 = original, 1 = solid black/white)
function mixColor(colorHex, mixColorHex, amount) {
  const c1 = hexToRGB(colorHex);
  const c2 = hexToRGB(mixColorHex);
  const r = Math.round(c1.r + (c2.r - c1.r) * amount);
  const g = Math.round(c1.g + (c2.g - c1.g) * amount);
  const b = Math.round(c1.b + (c2.b - c1.b) * amount);
  return rgbToHex(r, g, b);
}

export default function ColorTools() {
  const [baseHex, setBaseHex] = useState('#3a5582');
  const [rgb, setRgb] = useState(hexToRGB('#3a5582'));

  useEffect(() => {
    setRgb(hexToRGB(baseHex));
  }, [baseHex]);

  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: Number(value) };
    setRgb(newRgb);
    setBaseHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);

  const shades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(amount => mixColor(baseHex, '#000000', amount));
  const tints = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(amount => mixColor(baseHex, '#ffffff', amount));

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Advanced Color Tools</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Fine-tune your colors and generate precise 10-step shades & tints.</p>

      <div className="advanced-picker">
        <div style={{ flex: '0 0 200px' }}>
          <div style={{ width: '100%', aspectRatio: '1', backgroundColor: baseHex, borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }} />
          <input 
            type="color" 
            value={baseHex} 
            onChange={(e) => setBaseHex(e.target.value)}
            style={{ width: '100%', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          />
        </div>

        <div className="picker-sliders">
          <div className="slider-row">
            <span className="slider-label" style={{ color: '#ef4444' }}>R</span>
            <input type="range" min="0" max="255" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} />
            <input type="number" className="input-field rgb-input" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} />
          </div>
          <div className="slider-row">
            <span className="slider-label" style={{ color: '#10b981' }}>G</span>
            <input type="range" min="0" max="255" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} />
            <input type="number" className="input-field rgb-input" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} />
          </div>
          <div className="slider-row">
            <span className="slider-label" style={{ color: '#3b82f6' }}>B</span>
            <input type="range" min="0" max="255" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} />
            <input type="number" className="input-field rgb-input" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} />
          </div>
        </div>

        <div className="color-info-table">
          <div className="color-info-row">
            <div className="color-info-cell label">HEX</div>
            <div className="color-info-cell" style={{fontFamily: 'monospace'}}>{baseHex.toUpperCase()}</div>
          </div>
          <div className="color-info-row">
            <div className="color-info-cell label">RGB</div>
            <div className="color-info-cell" style={{fontFamily: 'monospace'}}>rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          </div>
          <div className="color-info-row">
            <div className="color-info-cell label">HSL</div>
            <div className="color-info-cell" style={{fontFamily: 'monospace'}}>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
          </div>
        </div>
      </div>

      <div className="shade-scale-container">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>10-Step Shade Generator</span>
          <span style={{color: 'var(--text-muted)'}}>Base: {baseHex.toUpperCase()}</span>
        </h3>
        
        {/* Shades (Darkening) */}
        <div style={{ display: 'flex', width: '100%', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
          {['Base', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'].map((lbl, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{lbl}</div>
          ))}
        </div>
        <div className="shade-row">
          {shades.map((hex, i) => (
            <div key={i} className="shade-block" style={{ backgroundColor: hex }} onClick={() => handleCopy(hex)}>
              <span className="shade-hex">{hex.slice(1)}</span>
            </div>
          ))}
        </div>

        {/* Tints (Lightening) */}
        <div className="shade-row" style={{ marginTop: '1rem' }}>
          {tints.map((hex, i) => (
            <div key={i} className="shade-block" style={{ backgroundColor: hex }} onClick={() => handleCopy(hex)}>
              <span className="shade-hex" style={{ color: i > 4 ? '#1e293b' : 'rgba(255,255,255,0.9)', textShadow: i > 4 ? 'none' : '0 1px 2px rgba(0,0,0,0.5)' }}>
                {hex.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
