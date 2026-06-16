import React, { useState, useEffect } from 'react';
import { Copy, Check, Sliders, Palette, Sun } from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────── */
function hexToRGB(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1]+hex[1],16); g = parseInt(hex[2]+hex[2],16); b = parseInt(hex[3]+hex[3],16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1,3),16); g = parseInt(hex.slice(3,5),16); b = parseInt(hex.slice(5,7),16);
  }
  return { r, g, b };
}
function rgbToHex(r,g,b) {
  return '#' + [r,g,b].map(v => Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');
}
function rgbToHSL(r,g,b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), delta=max-min;
  let h=0, s=0, l=(max+min)/2;
  if (delta) {
    s = delta / (1 - Math.abs(2*l-1));
    h = max===r ? ((g-b)/delta)%6 : max===g ? (b-r)/delta+2 : (r-g)/delta+4;
    h = Math.round(h*60); if(h<0) h+=360;
  }
  return { h, s: +(s*100).toFixed(1), l: +(l*100).toFixed(1) };
}
function hslToHex(h,s,l) {
  s/=100; l/=100;
  const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}
  else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}
  return rgbToHex(Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255));
}
function mix(hex1,hex2,t) {
  const a=hexToRGB(hex1), b=hexToRGB(hex2);
  return rgbToHex(Math.round(a.r+(b.r-a.r)*t),Math.round(a.g+(b.g-a.g)*t),Math.round(a.b+(b.b-a.b)*t));
}
function contrastColor(hex) {
  const {r,g,b}=hexToRGB(hex);
  return (0.299*r+0.587*g+0.114*b)/255 > 0.55 ? '#1e293b' : '#ffffff';
}

/* ─── small copy chip ───────────────────────────────────────── */
function CopyChip({ text }) {
  const [done, setDone] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(()=>setDone(false),1500);
  };
  return (
    <button className={`ct-copy-chip ${done?'done':''}`} onClick={copy} title={`Copy ${text}`}>
      {done ? <Check size={11}/> : <Copy size={11}/>}
    </button>
  );
}

/* ─── shade / tint row ──────────────────────────────────────── */
function ShadeRow({ label, swatches }) {
  return (
    <div className="ct-shade-group">
      <div className="ct-shade-label">{label}</div>
      <div className="ct-shade-track">
        {swatches.map((hex,i) => (
          <div key={i} className="ct-swatch" style={{background:hex}} title={hex}>
            <span className="ct-swatch-hex" style={{color:contrastColor(hex)}}>{hex.toUpperCase()}</span>
            <CopyChip text={hex.toUpperCase()} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────────── */
export default function ColorTools() {
  const [baseHex, setBaseHex] = useState('#6366f1');
  const [hexInput, setHexInput] = useState('6366F1');
  const [rgb, setRgb] = useState(hexToRGB('#6366f1'));
  const [copiedMain, setCopiedMain] = useState(false);
  const [activeTab, setActiveTab] = useState('picker'); // 'picker' | 'shades' | 'harmony'

  useEffect(() => { 
    setRgb(hexToRGB(baseHex)); 
    setHexInput(baseHex.replace('#', '').toUpperCase());
  }, [baseHex]);

  const handleHexInputChange = (e) => {
    let val = e.target.value.replace(/#/g, '');
    val = val.slice(0, 6); // Enforce max 6 chars without breaking paste
    setHexInput(val);
    if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(val)) {
      setBaseHex('#' + val);
    }
  };

  const handleRgbChange = (ch, val) => {
    const next = { ...rgb, [ch]: Math.max(0,Math.min(255,Number(val))) };
    setRgb(next);
    setBaseHex(rgbToHex(next.r,next.g,next.b));
  };

  const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);

  const shades = Array.from({length:10},(_,i)=>mix(baseHex,'#000000',i*0.09));
  const tints  = Array.from({length:10},(_,i)=>mix(baseHex,'#ffffff',i*0.09));

  const harmonyAngles = { Complementary:[180], Triadic:[120,240], Analogous:[30,60,-30,-60], 'Split-Comp':[150,210] };
  const harmonyColors = Object.entries(harmonyAngles).map(([name,angles])=>({
    name,
    colors: [baseHex, ...angles.map(a=>hslToHex((hsl.h+a+360)%360,hsl.s,hsl.l))]
  }));

  const copyMain = () => {
    navigator.clipboard.writeText(baseHex.toUpperCase());
    setCopiedMain(true); setTimeout(()=>setCopiedMain(false),1500);
  };

  const contrast = contrastColor(baseHex);

  return (
    <div className="ct-page">
      {/* Hero color display */}
      <div className="ct-hero" style={{ background: `linear-gradient(135deg, ${baseHex}, ${hslToHex((hsl.h+40)%360,hsl.s,hsl.l)})` }}>
        <div className="ct-hero-inner">
          <div className="ct-hero-hex" style={{ color: contrast }}>{baseHex.toUpperCase()}</div>
          <div className="ct-hero-sub" style={{ color: contrast }}>rgb({rgb.r}, {rgb.g}, {rgb.b}) · hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)</div>
          <button className="ct-hero-copy" style={{ color: contrast, borderColor: contrast }} onClick={copyMain}>
            {copiedMain ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy HEX</>}
          </button>
        </div>
        {/* Color picker inside hero */}
        <label className="ct-hero-picker-wrap" title="Pick a color">
          <input type="color" value={baseHex} onChange={e=>setBaseHex(e.target.value)} className="ct-hero-picker" />
          <span className="ct-hero-picker-label" style={{ color: contrast }}>Change Color</span>
        </label>
      </div>

      {/* Tab bar */}
      <div className="ct-tabs">
        {[
          { id: 'picker', label: 'Color Picker', icon: <Sliders size={16} /> },
          { id: 'shades', label: 'Shades & Tints', icon: <Palette size={16} /> },
          { id: 'harmony', label: 'Harmony', icon: <Sun size={16} /> }
        ].map(({ id, label, icon }) => (
          <button key={id} className={`ct-tab ${activeTab===id?'active':''}`} onClick={()=>setActiveTab(id)}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {icon} {label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab: Picker */}
      {activeTab === 'picker' && (
        <div className="ct-panel">
          <div className="ct-picker-grid">
            {/* Controls */}
            <div className="ct-picker-sliders">
              <div className="ct-picker-title">Color Controls</div>
              
              <div className="ct-slider-row" style={{ marginBottom: '0.75rem' }}>
                <span className="ct-slider-label" style={{ color: 'var(--text-main)' }}>#</span>
                <div className="ct-slider-wrap">
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    className="ct-num-input"
                    style={{ width: '100%', textAlign: 'left', padding: '0.65rem 1rem', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                    placeholder="6366F1"
                  />
                </div>
              </div>

              {[
                {ch:'r', label:'Red',   color:'#ef4444', track:'linear-gradient(to right,#000,#ff0000)'},
                {ch:'g', label:'Green', color:'#10b981', track:'linear-gradient(to right,#000,#00ff00)'},
                {ch:'b', label:'Blue',  color:'#3b82f6', track:'linear-gradient(to right,#000,#0000ff)'},
              ].map(({ch,label,color,track})=>(
                <div key={ch} className="ct-slider-row">
                  <span className="ct-slider-label" style={{color}}>{label[0]}</span>
                  <div className="ct-slider-wrap">
                    <input
                      type="range" min="0" max="255" value={rgb[ch]}
                      onChange={e=>handleRgbChange(ch,e.target.value)}
                      className="ct-rgb-slider"
                      style={{'--track':track}}
                    />
                  </div>
                  <input
                    type="number" min="0" max="255" value={rgb[ch]}
                    onChange={e=>handleRgbChange(ch,e.target.value)}
                    className="ct-num-input"
                  />
                </div>
              ))}
            </div>

            {/* Info table */}
            <div className="ct-info-card">
              <div className="ct-picker-title">Color Values</div>
              <div className="ct-info-table">
                {[
                  ['HEX', baseHex.toUpperCase()],
                  ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
                  ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
                  ['OKLCH', `${Math.round(hsl.l)}% ${(hsl.s/100*0.4).toFixed(2)} ${hsl.h}`],
                ].map(([fmt,val])=>(
                  <div key={fmt} className="ct-info-row">
                    <span className="ct-info-fmt">{fmt}</span>
                    <span className="ct-info-val">{val}</span>
                    <CopyChip text={val}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Shades & Tints */}
      {activeTab === 'shades' && (
        <div className="ct-panel">
          <ShadeRow label="Shades (darker)" swatches={shades} />
          <ShadeRow label="Tints (lighter)" swatches={tints} />
        </div>
      )}

      {/* Tab: Harmony */}
      {activeTab === 'harmony' && (
        <div className="ct-panel">
          <div className="ct-harmony-grid">
            {harmonyColors.map(({name,colors})=>(
              <div key={name} className="ct-harmony-card">
                <div className="ct-harmony-swatches">
                  {colors.map((c,i)=>(
                    <div key={i} className="ct-harmony-swatch" style={{background:c}} title={c}>
                      <CopyChip text={c.toUpperCase()}/>
                    </div>
                  ))}
                </div>
                <div className="ct-harmony-name">{name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
