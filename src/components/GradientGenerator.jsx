import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function GradientGenerator({ config, onChange }) {
  const handleStopChange = (index, field, value) => {
    const newStops = [...config.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    onChange({ ...config, stops: newStops });
  };

  const addStop = () => {
    if (config.stops.length >= 10) return;
    const lastStop = config.stops[config.stops.length - 1];
    const newPosition = Math.min(100, lastStop.position + 10);
    onChange({
      ...config,
      stops: [...config.stops, { color: '#ffffff', position: newPosition }]
    });
  };

  const removeStop = (index) => {
    if (config.stops.length <= 2) return;
    const newStops = config.stops.filter((_, i) => i !== index);
    onChange({ ...config, stops: newStops });
  };

  return (
    <div className="tool-panel">
      <div className="segmented-control">
        <button 
          className={`segmented-btn ${config.type === 'linear' ? 'active' : ''}`}
          onClick={() => onChange({ ...config, type: 'linear' })}
        >
          Linear
        </button>
        <button 
          className={`segmented-btn ${config.type === 'radial' ? 'active' : ''}`}
          onClick={() => onChange({ ...config, type: 'radial' })}
        >
          Radial
        </button>
      </div>

      {config.type === 'linear' && (
        <div className="control-group">
          <div className="control-header">
            <span className="control-label">Angle</span>
            <span className="control-value">{config.angle}°</span>
          </div>
          <input 
            type="range" 
            min="0" max="360" 
            value={config.angle} 
            onChange={(e) => onChange({ ...config, angle: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="control-group">
        <div className="control-header">
          <span className="control-label">Color Stops</span>
          <button className="btn btn-outline" onClick={addStop} disabled={config.stops.length >= 10}>
            <Plus size={16} /> Add
          </button>
        </div>
        
        <div className="layer-list">
          {config.stops.map((stop, index) => (
            <div key={index} className="layer-item">
              <div className="layer-info">
                <input 
                  type="color" 
                  value={stop.color}
                  onChange={(e) => handleStopChange(index, 'color', e.target.value)}
                  className="color-swatch"
                  style={{ padding: 0, border: 'none', background: 'none' }}
                />
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={stop.position}
                  onChange={(e) => handleStopChange(index, 'position', Number(e.target.value))}
                  style={{ width: '120px' }}
                />
                <span className="control-value">{stop.position}%</span>
              </div>
              <button 
                className="btn-icon btn-danger" 
                onClick={() => removeStop(index)}
                disabled={config.stops.length <= 2}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
