import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PageTransition } from '../components/PageTransition';
import { Mail, Calendar, Copy, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

const UserProfilePage: React.FC = () => {
  const { profile, signOut, refreshProfile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const translations = {
    ar: {
      myProfile: 'ملفي الشخصي',
      profileSettings: 'إعدادات الملف الشخصي',
      personalInfo: 'معلومات شخصية',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      userId: 'معرف المستخدم',
      provider: 'مزود الدخول',
      joinDate: 'تاريخ الانضمام',
      lastLogin: 'آخر تسجيل دخول',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      refresh: 'تحديث البيانات',
      refreshing: 'جاري التحديث...',
      logout: 'تسجيل الخروج',
      account: 'الحساب',
      security: 'الأمان',
      preferences: 'التفضيلات',
      accountSettings: 'إعدادات الحساب',
      securitySettings: 'إعدادات الأمان',
      preferenceSettings: 'إعدادات التفضيلات',
      changePassword: 'تغيير كلمة المرور',
      twoFactor: 'المصادقة الثنائية',
      loginHistory: 'سجل تسجيلات الدخول',
      language: 'اللغة',
      theme: 'الوضع الليلي',
      notifications: 'التنبيهات',
    },
    en: {
      myProfile: 'My Profile',
      profileSettings: 'Profile Settings',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email',
      userId: 'User ID',
      provider: 'Sign-in Provider',
      joinDate: 'Join Date',
      lastLogin: 'Last Login',
      copy: 'Copy',
      copied: 'Copied!',
      refresh: 'Refresh Data',
      refreshing: 'Refreshing...',
      logout: 'Logout',
      account: 'Account',
      security: 'Security',
      preferences: 'Preferences',
      accountSettings: 'Account Settings',
      securitySettings: 'Security Settings',
      preferenceSettings: 'Preference Settings',
      changePassword: 'Change Password',
      twoFactor: 'Two-Factor Authentication',
      loginHistory: 'Login History',
      language: 'Language',
      theme: 'Dark Mode',
      notifications: 'Notifications',
    },
  };

  const t = translations[language as keyof typeof translations];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProfile();
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageTransition>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="page-title">{t.myProfile}</h1>
            <p className="page-subtitle">{t.profileSettings}</p>
          </div>

          <div className="profile-content">
            {/* Left Section - Profile Card */}
            <div className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-avatar-section">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile Avatar"
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                <h2 className="profile-name">{profile?.full_name}</h2>
                <p className="profile-email">{profile?.email}</p>

                <div className="profile-actions">
                  <button
                    className="action-button refresh"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title={t.refresh}
                  >
                    <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
                    <span>{isRefreshing ? t.refreshing : t.refresh}</span>
                  </button>

                  <button
                    className="action-button logout"
                    onClick={handleLogout}
                    title={t.logout}
                  >
                    <LogOut size={18} />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Profile Details */}
            <div className="profile-main">
              {/* Personal Information */}
              <section className="profile-section">
                <h2 className="section-title">{t.personalInfo}</h2>

                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">{t.fullName}</label>
                    <div className="info-value-group">
                      <p className="info-value">{profile?.full_name}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">{t.email}</label>
                    <div className="info-value-group">
                      <div className="info-value-with-icon">
                        <Mail size={18} />
                        <p className="info-value">{profile?.email}</p>
                      </div>
                      <button
                        className="copy-button"
                        onClick={() => handleCopy(profile?.email || '')}
                        title={t.copy}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">{t.userId}</label>
                    <div className="info-value-group">
                      <p className="info-value code">{profile?.id?.slice(0, 12)}...</p>
                      <button
                        className="copy-button"
                        onClick={() => handleCopy(profile?.id || '')}
                        title={t.copy}
                      >
                        <Copy size={16} />
                        {copied && <span className="copy-feedback">{t.copied}</span>}
                      </button>
                    </div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">{t.provider}</label>
                    <div className="info-value-group">
                      <p className="info-value provider-badge">{profile?.provider}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dates Section */}
              <section className="profile-section">
                <h2 className="section-title">التواريخ</h2>

                <div className="info-group">
                  <div className="info-item">
                    <label className="info-label">{t.joinDate}</label>
                    <div className="info-value-group">
                      <div className="info-value-with-icon">
                        <Calendar size={18} />
                        <p className="info-value">{formatDate(profile?.created_at || '')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <label className="info-label">{t.lastLogin}</label>
                    <div className="info-value-group">
                      <div className="info-value-with-icon">
                        <Calendar size={18} />
                        <p className="info-value">{formatDate(profile?.last_login || '')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Settings Tabs */}
              <section className="profile-section">
                <div className="settings-tabs">
                  <button className="tab-button active">{t.accountSettings}</button>
                  <button className="tab-button">{t.securitySettings}</button>
                  <button className="tab-button">{t.preferenceSettings}</button>
                </div>

                <div className="settings-content">
                  <div className="settings-item">
                    <h3>{t.changePassword}</h3>
                    <p>Update your password regularly to keep your account secure</p>
                    <button className="settings-action-button">Change Password</button>
                  </div>

                  <div className="settings-item">
                    <h3>{t.twoFactor}</h3>
                    <p>Add an extra layer of security to your account</p>
                    <button className="settings-action-button">Enable 2FA</button>
                  </div>

                  <div className="settings-item">
                    <h3>{t.loginHistory}</h3>
                    <p>View and manage your recent login activities</p>
                    <button className="settings-action-button">View History</button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfilePage;
