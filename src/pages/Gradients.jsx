import React, { useState } from 'react';
import GradientGenerator from '../components/GradientGenerator';
import Preview from '../components/Preview';
import CodeOutput from '../components/CodeOutput';

export default function Gradients() {
  const [gradientConfig, setGradientConfig] = useState({
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#6366f1', position: 0 },
      { color: '#f43f5e', position: 100 }
    ]
  });

  return (
    <div className="tool-layout">
      <div className="tool-controls">
        <div className="tool-controls-header">
          <h2>Gradient Generator</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Visually build complex CSS gradients.</p>
        </div>
        <div className="tool-controls-body">
          <GradientGenerator config={gradientConfig} onChange={setGradientConfig} />
        </div>
      </div>
      
      <div className="tool-preview-area">
        <div className="preview-box-wrapper">
          <Preview gradientConfig={gradientConfig} shadows={[]} backgroundColor="transparent" />
        </div>
        <CodeOutput gradientConfig={gradientConfig} shadows={[]} />
      </div>
    </div>
  );
}
