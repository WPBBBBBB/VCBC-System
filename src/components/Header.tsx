import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe, LogOut, User, LogIn } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, profile, signOut, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // إغلاق القائمة المنسدلة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M16 8L8 12V20C8 23.3137 11.134 26 16 26C20.866 26 24 23.3137 24 20V12L16 8Z" fill="white" fillOpacity="0.9"/>
              <path d="M16 10L10 13V20C10 22.2091 12.2386 24 16 24C19.7614 24 22 22.2091 22 20V13L16 10Z" fill="url(#innerGradient)"/>
              <path d="M14 17L15.5 18.5L18 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6B72FF"/>
                  <stop offset="1" stopColor="#5D3FD3"/>
                </linearGradient>
                <linearGradient id="innerGradient" x1="10" y1="10" x2="22" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5D3FD3"/>
                  <stop offset="1" stopColor="#4B2FB5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">CVBC System</span>
        </Link>

        {/* Navigation */}
        {!isActive('/login') && (
          <nav className="header-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              {t('home')}
            </Link>
            <Link to="/verify" className={`nav-link ${isActive('/verify') ? 'active' : ''}`}>
              {t('verify')}
            </Link>
          </nav>
        )}

        {/* Actions */}
        <div className="header-actions">
          {/* Language Switcher */}
          <button className="action-btn language-btn" onClick={toggleLanguage} title={t('language')}>
            <Globe size={20} />
            <span className="lang-label">{language.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button className="action-btn theme-btn" onClick={toggleTheme} title={theme === 'light' ? t('darkMode') : t('lightMode')}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User Section */}
          {isLoading ? (
            <div className="loading-indicator">...</div>
          ) : user && profile ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="User menu"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="User Avatar" className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {profile.full_name?.charAt(0) || 'U'}
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <h3>{profile.full_name}</h3>
                    <p>{profile.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigate('/dashboard')}
                  >
                    <User size={16} />
                    <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigate('/account')}
                  >
                    <User size={16} />
                    <span>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigate('/verification-history')}
                  >
                    <User size={16} />
                    <span>{language === 'ar' ? 'السجل' : 'History'}</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="action-btn login-btn">
              <LogIn size={20} />
              <span>{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
