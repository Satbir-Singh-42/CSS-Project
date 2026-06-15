import React, { useState, useMemo, useEffect } from 'react';
import { Heart, Sparkles, Flame, Shuffle, FolderHeart, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const MOCK_PALETTES = [
  { id: 1, colors: ['#ffb703', '#fb8500', '#023047', '#219ebc'], likes: 1845, time: 2, tag: 'Warm' },
  { id: 2, colors: ['#52b788', '#74c69d', '#95d5b2', '#d8f3dc'], likes: 1250, time: 5, tag: 'Pastel' },
  { id: 3, colors: ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f'], likes: 934, time: 12, tag: 'Retro' },
  { id: 4, colors: ['#7400b8', '#6930c3', '#5e60ce', '#5390d9'], likes: 2100, time: 24, tag: 'Neon' },
  { id: 5, colors: ['#000000', '#14213d', '#fca311', '#e5e5e5'], likes: 1450, time: 48, tag: 'Dark' },
  { id: 6, colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4'], likes: 890, time: 72, tag: 'Warm' },
  { id: 7, colors: ['#a8dadc', '#457b9d', '#1d3557', '#f1faee'], likes: 2310, time: 96, tag: 'Cold' },
  { id: 8, colors: ['#ffafcc', '#ffc8dd', '#cdb4db', '#bde0fe'], likes: 3240, time: 120, tag: 'Pastel' },
  { id: 9, colors: ['#283618', '#606c38', '#fefae0', '#dda15e'], likes: 1670, time: 168, tag: 'Vintage' },
  { id: 10, colors: ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7'], likes: 1120, time: 168, tag: 'Vintage' },
  { id: 11, colors: ['#fca311', '#14213d', '#000000', '#e5e5e5'], likes: 980, time: 336, tag: 'Warm' },
  { id: 12, colors: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef'], likes: 745, time: 336, tag: 'Cold' },
];

export default function Home({ searchQuery }) {
  const [palettes, setPalettes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('New');
  const [activeTag, setActiveTag] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');

  // Fetch from Supabase OR use Mock Data
  useEffect(() => {
    async function fetchPalettes() {
      setIsLoading(true);
      if (isSupabaseConfigured) {
        try {
          let query = supabase.from('palettes').select('*');
          
          if (activeTag) {
            query = query.eq('tag', activeTag);
          }
          
          if (activeFilter === 'Popular') {
            query = query.order('likes', { ascending: false });
          } else if (activeFilter === 'New') {
            query = query.order('created_at', { ascending: false });
          }

          const { data, error } = await query;
          
          if (error) throw error;
          
          // Map DB columns to our frontend expectations
          const formattedData = data.map(p => ({
            id: p.id,
            colors: p.colors,
            likes: p.likes,
            tag: p.tag,
            // Calculate fake "hours ago" for demo if time doesn't exist, normally we'd use actual date math
            time: Math.floor((new Date() - new Date(p.created_at)) / (1000 * 60 * 60))
          }));
          
          setPalettes(formattedData);
        } catch (error) {
          console.error("Error fetching from Supabase:", error);
          setToastMessage("Database error. Falling back to local data.");
          setTimeout(() => setToastMessage(''), 3000);
          setPalettes(MOCK_PALETTES);
        }
      } else {
        // Fallback to mock data immediately
        setPalettes(MOCK_PALETTES);
      }
      setIsLoading(false);
    }

    fetchPalettes();
  }, [activeFilter, activeTag]);

  const handleCopy = (e, color) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setToastMessage(`Copied ${color.toUpperCase()} to clipboard!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleLike = async (e, id) => {
    e.stopPropagation();
    const newLiked = new Set(likedIds);
    let likeModifier = 1;

    if (newLiked.has(id)) {
      newLiked.delete(id);
      likeModifier = -1;
    } else {
      newLiked.add(id);
    }
    setLikedIds(newLiked);

    // Optimistic UI update
    setPalettes(prev => prev.map(p => 
      p.id === id ? { ...p, likes: p.likes + likeModifier } : p
    ));

    // Update real database if configured
    if (isSupabaseConfigured) {
      try {
        const palette = palettes.find(p => p.id === id);
        if (palette) {
          await supabase
            .from('palettes')
            .update({ likes: palette.likes + likeModifier })
            .eq('id', id);
        }
      } catch (err) {
        console.error("Failed to update likes in DB", err);
      }
    }
  };

  const toggleTag = (tag) => {
    if (activeTag === tag) setActiveTag(null);
    else setActiveTag(tag);
    setActiveFilter('New');
  };

  // Client-side filtering for Search, Random, and Collection
  const displayPalettes = useMemo(() => {
    let result = [...palettes];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.tag.toLowerCase().includes(q) || 
        p.colors.some(c => c.toLowerCase().includes(q))
      );
    }

    if (activeFilter === 'Collection') {
      result = result.filter(p => likedIds.has(p.id));
    } else if (activeFilter === 'Random') {
      // In a real app we'd query Supabase with a random RPC, but client-side is fine for now
      result.sort(() => Math.random() - 0.5);
    }

    return result;
  }, [palettes, searchQuery, activeFilter, likedIds]);

  return (
    <div style={{ paddingBottom: '4rem', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: '#1e293b', color: 'white', padding: '0.75rem 1.5rem',
          borderRadius: '100px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 100, fontWeight: 600, animation: 'fadeInUp 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Discover Beautiful Color Schemes</h1>
        <p>A curated collection of hand-picked palettes for your next design project.</p>
        
        {/* Supabase Status Indicator */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem', background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: isSupabaseConfigured ? '#10b981' : '#d97706', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Database size={14} />
          {isSupabaseConfigured ? 'Connected to Live Supabase Database' : 'Using Local Mock Database (Supabase not configured)'}
        </div>
      </section>

      {/* Horizontal Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <button 
            className={`filter-pill ${activeFilter === 'New' && !activeTag ? 'active' : ''}`}
            onClick={() => {setActiveFilter('New'); setActiveTag(null);}}
          ><Sparkles size={16}/> New</button>
          
          <button 
            className={`filter-pill ${activeFilter === 'Popular' && !activeTag ? 'active' : ''}`}
            onClick={() => {setActiveFilter('Popular'); setActiveTag(null);}}
          ><Flame size={16}/> Popular</button>
          
          <button 
            className={`filter-pill ${activeFilter === 'Random' && !activeTag ? 'active' : ''}`}
            onClick={() => {setActiveFilter('Random'); setActiveTag(null);}}
          ><Shuffle size={16}/> Random</button>
          
          <button 
            className={`filter-pill ${activeFilter === 'Collection' && !activeTag ? 'active' : ''}`}
            onClick={() => {setActiveFilter('Collection'); setActiveTag(null);}}
          ><FolderHeart size={16}/> Collection ({likedIds.size})</button>
        </div>
        
        <div className="filter-divider"></div>
        
        <div className="filter-group">
          {['Pastel', 'Vintage', 'Retro', 'Neon', 'Dark', 'Warm', 'Cold'].map(tag => (
            <button 
              key={tag}
              className={`filter-pill ${activeTag === tag ? 'active' : 'outline'}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Unique Palette Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
          Loading palettes...
        </div>
      ) : displayPalettes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <h3>No palettes found.</h3>
          <p>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="unique-palette-grid">
          {displayPalettes.map((palette) => {
            const isLiked = likedIds.has(palette.id);
            return (
              <div key={palette.id} className="unique-palette-card">
                <div 
                  className="main-color-area" 
                  style={{ backgroundColor: palette.colors[0] }}
                  onClick={(e) => handleCopy(e, palette.colors[0])}
                >
                   <span className="hex-badge">{palette.colors[0].toUpperCase()}</span>
                </div>
                <div className="accent-colors-container">
                  {palette.colors.slice(1).map((color, idx) => (
                    <div 
                      key={idx} 
                      className="accent-circle" 
                      style={{ backgroundColor: color }}
                      onClick={(e) => handleCopy(e, color)}
                    >
                      <div className="tooltip">{color.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
                
                <div className="palette-footer" style={{ marginTop: '1rem', borderTop: 'none', padding: '0 1.5rem 1.5rem 1.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    className="like-btn" 
                    title="Save to Collection"
                    onClick={(e) => handleLike(e, palette.id)}
                    style={{ 
                      color: isLiked ? 'var(--accent)' : 'var(--text-muted)',
                      borderColor: isLiked ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-color)',
                      backgroundColor: isLiked ? 'rgba(244, 63, 94, 0.05)' : 'transparent',
                      padding: '0.6rem'
                    }}
                  >
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
