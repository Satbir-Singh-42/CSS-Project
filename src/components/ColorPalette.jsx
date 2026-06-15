import React from 'react';
import { Copy } from 'lucide-react';

function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return {h, s, l};
}

function HSLToHex(h,s,l) {
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
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  return "#" + r + g + b;
}

export default function ColorPalette({ config, onChange }) {
  const { baseColor, mode } = config;
  
  const generatePalette = () => {
    const { h, s, l } = hexToHSL(baseColor);
    let palette = [];
    if (mode === 'complementary') {
      palette = [baseColor, HSLToHex((h + 180) % 360, s, l)];
    } else if (mode === 'analogous') {
      palette = [
        HSLToHex((h - 30 + 360) % 360, s, l),
        baseColor,
        HSLToHex((h + 30) % 360, s, l)
      ];
    } else if (mode === 'triadic') {
      palette = [
        baseColor,
        HSLToHex((h + 120) % 360, s, l),
        HSLToHex((h + 240) % 360, s, l)
      ];
    } else if (mode === 'shades') {
      palette = [
        HSLToHex(h, s, Math.min(100, l + 40)),
        HSLToHex(h, s, Math.min(100, l + 20)),
        baseColor,
        HSLToHex(h, s, Math.max(0, l - 20)),
        HSLToHex(h, s, Math.max(0, l - 40))
      ];
    }
    return palette;
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="tool-panel">
      <div className="control-group">
        <div className="control-header">
          <span className="control-label">Base Color</span>
        </div>
        <div className="flex-row">
          <input 
            type="color" 
            value={baseColor} 
            onChange={(e) => onChange({ ...config, baseColor: e.target.value })}
            className="input-field"
            style={{ width: '60px', padding: '0.25rem' }}
          />
          <input 
            type="text" 
            value={baseColor} 
            onChange={(e) => onChange({ ...config, baseColor: e.target.value })}
            className="input-field w-full"
          />
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Schema Mode</span>
        <select 
          className="input-field" 
          value={mode} 
          onChange={(e) => onChange({ ...config, mode: e.target.value })}
        >
          <option value="complementary">Complementary</option>
          <option value="analogous">Analogous</option>
          <option value="triadic">Triadic</option>
          <option value="shades">Shades & Tints</option>
        </select>
      </div>

      <div className="control-group" style={{marginTop: '1rem'}}>
        <span className="control-label">Generated Palette (Click to copy)</span>
        <div className="palette-grid">
          {generatePalette().map((color, i) => (
            <div 
              key={i} 
              className="color-block" 
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color)}
              title={`Copy ${color}`}
            >
              <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px', textAlign: 'center', padding: '2px 0' }}>
                {color.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
