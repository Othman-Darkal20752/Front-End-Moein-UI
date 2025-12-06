// src/App.jsx - Main application wrapper
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getTheme, setTheme } from './utils/storage';
import AppRoutes from './router.jsx';
import WhatsAppIconUrl from './assets/icons/whatsapp.svg';
import GithubIconUrl from './assets/icons/github.svg';

const STORAGE_THEME = 'app_theme';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, logout } = useAuth();
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const navButtons = useMemo(() => {
    const buttons = [
      { to: '/', label: 'Login', icon: '🔐', exact: true, auth: false },
      { to: '/register', label: 'Sign Up', icon: '📝', auth: false },
    ];

    if (isAuth) {
      buttons.push(
        { to: '/dashboard', label: 'Dashboard', icon: '📊', auth: true },
        { to: '/courses', label: 'Courses', icon: '📚', auth: true },
        { to: '/account', label: 'Account', icon: '👤', auth: true }
      );
    }

    return buttons;
  }, [isAuth]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'}`,
        backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ffffff' : '#24292f',
              textDecoration: 'none'
            }}>
              📚 EduHub
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {navButtons.map((b) => {
                const isActive = location.pathname === b.to;
                return (
                  <Link
                    key={b.to}
                    to={b.to}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      backgroundColor: isActive 
                        ? (theme === 'dark' ? '#21262d' : '#f0f0f0')
                        : 'transparent',
                      color: isActive
                        ? (theme === 'dark' ? '#ffffff' : '#24292f')
                        : (theme === 'dark' ? '#8b949e' : '#57606a')
                    }}
                  >
                    {b.icon && <span style={{ marginRight: '0.5rem' }}>{b.icon}</span>}
                    {b.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                border: 'none',
                backgroundColor: theme === 'dark' ? '#21262d' : '#f0f0f0',
                color: theme === 'dark' ? '#8b949e' : '#57606a',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {isAuth && (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: 'none',
                  backgroundColor: theme === 'dark' ? '#3d2621' : '#ffebe6',
                  color: theme === 'dark' ? '#ff7b72' : '#d1242f',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <AppRoutes />
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        borderTop: `1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'}`,
        backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#6e7681' : '#8c959f' }}>
              © 2025 MOEIN.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a 
                href="https://wa.me/963968271002" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: theme === 'dark' ? '#6e7681' : '#8c959f',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Contact us on WhatsApp"
                onMouseEnter={(e) => e.target.style.color = theme === 'dark' ? '#3fb950' : '#1a7f37'}
                onMouseLeave={(e) => e.target.style.color = theme === 'dark' ? '#6e7681' : '#8c959f'}
              >
                <img src={WhatsAppIconUrl} alt="WhatsApp" style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
              <a 
                href="https://github.com/Othman-Darkal20752" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: theme === 'dark' ? '#6e7681' : '#8c959f',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Visit our GitHub"
                onMouseEnter={(e) => e.target.style.color = theme === 'dark' ? '#c9d1d9' : '#24292f'}
                onMouseLeave={(e) => e.target.style.color = theme === 'dark' ? '#6e7681' : '#8c959f'}
              >
                <img src={GithubIconUrl} alt="GitHub" style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}