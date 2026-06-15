import React from 'react';

export default function Preview({ gradientConfig, shadows, backgroundColor }) {
  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const shadowString = shadows.map(s => 
    `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`
  ).join(', ');

  const stopsString = [...gradientConfig.stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');
  
  const backgroundString = gradientConfig.type === 'linear'
    ? `linear-gradient(${gradientConfig.angle}deg, ${stopsString})`
    : `radial-gradient(circle, ${stopsString})`;

  return (
    <div className="preview-container" style={{ backgroundColor }}>
      <div 
        className="preview-box" 
        style={{ 
          background: backgroundString, 
          boxShadow: shadowString,
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        Preview
      </div>
    </div>
  );
}
