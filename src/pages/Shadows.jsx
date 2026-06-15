import React, { useState } from 'react';
import ShadowGenerator from '../components/ShadowGenerator';
import Preview from '../components/Preview';
import CodeOutput from '../components/CodeOutput';

export default function Shadows() {
  const [shadows, setShadows] = useState([
    { x: 0, y: 10, blur: 25, spread: -5, color: '#000000', opacity: 0.1, inset: false },
    { x: 0, y: 4, blur: 6, spread: -2, color: '#000000', opacity: 0.05, inset: false }
  ]);

  return (
    <div className="tool-layout">
      <div className="tool-controls">
        <div className="tool-controls-header">
          <h2>Shadow Generator</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Layer multiple box shadows for depth.</p>
        </div>
        <div className="tool-controls-body">
          <ShadowGenerator shadows={shadows} onChange={setShadows} />
        </div>
      </div>
      
      <div className="tool-preview-area">
        <div className="preview-box-wrapper">
          <Preview 
            gradientConfig={{type: 'linear', stops: [{color: '#ffffff', position: 0}, {color: '#ffffff', position: 100}]}} 
            shadows={shadows} 
            backgroundColor="transparent" 
          />
        </div>
        <CodeOutput 
          gradientConfig={{type: 'linear', stops: [{color: '#ffffff', position: 0}, {color: '#ffffff', position: 100}]}} 
          shadows={shadows} 
        />
      </div>
    </div>
  );
}
