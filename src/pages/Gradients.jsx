import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import GradientGenerator from '../components/GradientGenerator';
import CodeOutput from '../components/CodeOutput';

export default function Gradients() {
  const [gradientConfig, setGradientConfig] = useState({
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#6366f1', position: 0 },
      { color: '#ec4899', position: 50 },
      { color: '#f43f5e', position: 100 }
    ]
  });

  const stopsString = [...gradientConfig.stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  const backgroundString = gradientConfig.type === 'linear'
    ? `linear-gradient(${gradientConfig.angle}deg, ${stopsString})`
    : `radial-gradient(circle, ${stopsString})`;

  return (
    <>
      {/* Full-screen live gradient background */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: backgroundString,
          zIndex: -1,
          transition: 'background 0.4s ease'
        }}
      />

      {/* Centered glass panel */}
      <div className="gradient-page-layout">
        <div className="gradient-glass-card">
          {/* Header */}
          <div className="gradient-glass-header">
            <div className="gradient-glass-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <Palette size={32} />
            </div>
            <h2>Gradient Studio</h2>
            <p>Build beautiful, complex CSS gradients in real‑time.</p>
          </div>

          {/* Controls */}
          <GradientGenerator config={gradientConfig} onChange={setGradientConfig} />

          {/* Code output */}
          <div style={{ marginTop: '1.5rem' }}>
            <CodeOutput gradientConfig={gradientConfig} shadows={[]} />
          </div>
        </div>
      </div>
    </>
  );
}
