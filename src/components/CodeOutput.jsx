import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeOutput({ gradientConfig, shadows }) {
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1,3),16)||0;
    const g = parseInt(hex.slice(3,5),16)||0;
    const b = parseInt(hex.slice(5,7),16)||0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const shadowString = shadows.length > 0
    ? shadows.map(s =>
        `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`
      ).join(',\n    ')
    : null;

  const stopsString = [...gradientConfig.stops]
    .sort((a,b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  const isWhiteGradient = gradientConfig.stops.every(s => s.color === '#ffffff');

  const backgroundString = gradientConfig.type === 'linear'
    ? `linear-gradient(${gradientConfig.angle}deg, ${stopsString})`
    : `radial-gradient(circle, ${stopsString})`;

  const lines = [];
  if (!isWhiteGradient) lines.push(`  background: ${backgroundString};`);
  if (shadowString) lines.push(`  box-shadow:\n    ${shadowString};`);
  const cssString = `.element {\n${lines.join('\n')}\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-panel">
      <div className="code-header">
        <h3>CSS Output</h3>
        <button className="btn btn-primary" onClick={handleCopy}>
          {copied ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy CSS</>}
        </button>
      </div>
      <pre className="code-content">{cssString}</pre>
    </div>
  );
}
