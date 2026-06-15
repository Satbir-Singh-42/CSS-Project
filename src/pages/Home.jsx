import React, { useState, useMemo, useEffect } from 'react';
import { Heart, Sparkles, Flame, Shuffle, FolderHeart, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';


// Simple deterministic random number generator based on a string seed
function seededRandom(seedStr) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 2654435761);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296; // Return float between 0 and 1
  }
}

// Defensive helper to fix manually imported named colors that incorrectly have a # prefix (e.g. #BURLYWOOD)
const formatColor = (c) => {
  if (!c) return '#000000';
  if (c.startsWith('#') && c.length > 7) {
    return c.substring(1); // Return 'BURLYWOOD' instead of '#BURLYWOOD'
  }
  return c;
};

export default function Home({ searchQuery }) {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('New');
  const [activeTag, setActiveTag] = useState(null);
  const [likedIds, setLikedIds] = useState(() => {
    const saved = localStorage.getItem('likedPalettes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [toastMessage, setToastMessage] = useState('');

  // Persist collection to cache whenever it changes
  useEffect(() => {
    localStorage.setItem('likedPalettes', JSON.stringify([...likedIds]));
  }, [likedIds]);

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
          setToastMessage("Database error.");
          setTimeout(() => setToastMessage(''), 3000);
          setPalettes([]);
        }
      } else {
        setPalettes([]);
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

    // 1. FIRST STEP: Deterministically choose exactly 50 palettes for the day
    if (result.length > 50) {
      const dateSeed = new Date().toDateString();
      const rand = seededRandom(dateSeed);
      
      // Shuffle array deterministically so it's random but locked for 24 hours
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      
      // Keep only the top 50 as the daily pool
      result = result.slice(0, 50);
    }

    // 2. NOW apply all user filters strictly on those 50 palettes
    if (activeTag) {
      result = result.filter(p => p.tag === activeTag);
    }
    
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
      // Shuffle the 50 palettes purely randomly on every click
      result.sort(() => Math.random() - 0.5);
    } else if (activeFilter === 'Popular') {
      // Sort the 50 palettes by highest likes
      result.sort((a, b) => b.likes - a.likes);
    } else if (activeFilter === 'New') {
      // Sort the 50 palettes by newest creation date
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [palettes, activeFilter, activeTag, searchQuery, likedIds]);

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
          
          {user && (
            <button 
              className={`filter-pill ${activeFilter === 'Collection' && !activeTag ? 'active' : ''}`}
              onClick={() => {setActiveFilter('Collection'); setActiveTag(null);}}
            ><FolderHeart size={16}/> Collection ({likedIds.size})</button>
          )}
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
        <div className="unique-palette-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="unique-palette-card skeleton-card">
              <div className="skeleton-color-row skeleton-shimmer"></div>
              <div className="skeleton-info">
                <div className="skeleton-text skeleton-shimmer"></div>
                <div className="skeleton-circle skeleton-shimmer"></div>
              </div>
            </div>
          ))}
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
                <div className="palette-colors-row">
                  {palette.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="palette-color-block" 
                      style={{ backgroundColor: formatColor(color) }}
                      onClick={(e) => handleCopy(e, color)}
                    >
                      <div className="tooltip">{formatColor(color).toUpperCase()}</div>
                    </div>
                  ))}
                </div>
                
                <div className="palette-footer" style={{ marginTop: '1rem', borderTop: 'none', padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                    {palette.likes.toLocaleString()} likes
                  </div>
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
