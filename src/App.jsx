import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gradients from './pages/Gradients';
import Shadows from './pages/Shadows';
import ColorTools from './pages/ColorTools';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="page-container container">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/gradients" element={<Gradients />} />
            <Route path="/shadows" element={<Shadows />} />
            <Route path="/color-tools" element={<ColorTools />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
