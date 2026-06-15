import React from 'react';
import { NavLink } from 'react-router-dom';
import { Palette, Droplet, Box, SlidersHorizontal, Search } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="nav-brand">
          <Palette size={28} color="var(--primary)" />
          <span>ColorStyles</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
            <Palette size={18} /> <span>Palettes</span>
          </NavLink>
          <NavLink to="/gradients" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Droplet size={18} /> <span>Gradients</span>
          </NavLink>
          <NavLink to="/shadows" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Box size={18} /> <span>Shadows</span>
          </NavLink>
          <NavLink to="/color-tools" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <SlidersHorizontal size={18} /> <span>Color Tools</span>
          </NavLink>
        </div>

        <div className="nav-actions">
          <div className="nav-search-container">
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="nav-search-input"
              placeholder="Search palettes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" style={{ borderRadius: '20px' }}>
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
