import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CloudCost from './pages/CloudCost';
import TokenCounter from './pages/TokenCounter';
import Comparison from './pages/Comparison';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const USD_TO_INR = 83.5;
export { USD_TO_INR };

function App() {
  const [dark, setDark] = useState(false);

  const theme = {
    dark,
    toggle: () => setDark(d => !d),
    bg: dark ? '#0f172a' : '#f0fdf4',
    card: dark ? '#1e293b' : '#ffffff',
    text: dark ? '#f1f5f9' : '#14532d',
    subtext: dark ? '#94a3b8' : '#6b7280',
    border: dark ? '#334155' : '#d1fae5',
    navBg: dark ? '#0f172a' : '#15803d',
    accent: dark ? '#4ade80' : '#15803d',
    inputBg: dark ? '#0f172a' : '#ffffff',
    tableBg: dark ? '#1e293b' : '#f9fafb',
    tableHead: dark ? '#0f172a' : '#f0fdf4',
  };

  return (
    <ThemeContext.Provider value={theme}>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: 'Segoe UI, sans-serif', transition: 'all 0.3s ease' }}>
          <Navbar />
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
            <Routes>
              <Route path="/" element={<CloudCost />} />
              <Route path="/tokens" element={<TokenCounter />} />
              <Route path="/comparison" element={<Comparison />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;