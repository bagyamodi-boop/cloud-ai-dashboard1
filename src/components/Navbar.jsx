import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../App';

function Navbar() {
  const location = useLocation();
  const theme = useTheme();

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#bbf7d0' : 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.15)' : 'transparent',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  });

  return (
    <nav style={{
      backgroundColor: theme.navBg,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🌱</span>
        <div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', lineHeight: '1.2' }}>Cloud Sustainability</div>
          <div style={{ color: '#bbf7d0', fontSize: '11px' }}>Energy & Cost Analyzer</div>
        </div>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <Link to="/" style={linkStyle('/')}>☁️ Cloud Cost</Link>
        <Link to="/tokens" style={linkStyle('/tokens')}>⚡ Token Counter</Link>
        <Link to="/comparison" style={linkStyle('/comparison')}>📊 Comparison</Link>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={theme.toggle}
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: '999px',
          padding: '6px 16px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease',
        }}
      >
        {theme.dark ? '☀️ Light' : '🌙 Dark'}
      </button>
    </nav>
  );
}

export default Navbar;