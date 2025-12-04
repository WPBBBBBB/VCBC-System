import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Shield,
  Languages,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { admin, logout } = useAdmin();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (window.confirm(language === 'ar' ? 'هل تريد تسجيل الخروج؟' : 'Are you sure you want to logout?')) {
      setIsLoggingOut(true);
      logout();
    }
  };

  const translations = {
    ar: {
      dashboard: 'لوحة التحكم',
      issueCertificate: 'إصدار شهادة',
      issuedCertificates: 'الشهادات المصدرة',
      managers: 'إدارة المشرفين',
      verificationHistory: 'سجل التحققات',
      logout: 'تسجيل الخروج',
      admin: 'مشرف',
    },
    en: {
      dashboard: 'Dashboard',
      issueCertificate: 'Issue Certificate',
      issuedCertificates: 'Issued Certificates',
      managers: 'Manage Admins',
      verificationHistory: 'Verification History',
      logout: 'Logout',
      admin: 'Administrator',
    },
  };

  const t = translations[language as keyof typeof translations];

  const menuItems = [
    {
      path: '/dashboard/home',
      icon: LayoutDashboard,
      label: t.dashboard,
    },
    {
      path: '/dashboard/issue',
      icon: FileText,
      label: t.issueCertificate,
    },
    {
      path: '/dashboard/issued',
      icon: FolderOpen,
      label: t.issuedCertificates,
    },
    {
      path: '/dashboard/managers',
      icon: Users,
      label: t.managers,
    },
    {
      path: '/dashboard/history',
      icon: History,
      label: t.verificationHistory,
    },
  ];

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Admin Info */}
      <div className="sidebar-header">
        <div className="admin-avatar">
          {admin?.avatar_url ? (
            <img src={admin.avatar_url} alt={admin.name} />
          ) : (
            <Shield size={24} />
          )}
        </div>
        {!isCollapsed && (
          <div className="admin-info">
            <h3>{admin?.name || 'Admin'}</h3>
            <span className="admin-role">{t.admin}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        <button className="language-toggle" onClick={toggleLanguage} aria-label="Toggle language">
          <Languages size={20} />
          {!isCollapsed && <span>{language === 'ar' ? 'English' : 'عربي'}</span>}
        </button>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>{t.logout}</span>}
        </button>
      </div>
    </div>
  );
};
