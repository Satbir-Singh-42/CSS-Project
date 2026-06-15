import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gradients from './pages/Gradients';
import Shadows from './pages/Shadows';
import ColorTools from './pages/ColorTools';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
          <div className="page-container container">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/gradients" element={<Gradients />} />
              <Route path="/shadows" element={<Shadows />} />
              <Route path="/color-tools" element={<ColorTools />} />
            </Routes>
          </div>
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}
