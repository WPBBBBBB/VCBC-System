import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PageTransition } from '../components/PageTransition';
import { LogOut, FileCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { profile, signOut, verificationHistory } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const translations = {
    ar: {
      greeting: 'مرحباً، {name} 👋',
      welcome: 'أهلاً وسهلاً في لوحة التحكم الخاصة بك',
      stats: {
        totalVerifications: 'إجمالي التحققات',
        validCertificates: 'شهادات صحيحة',
        invalidCertificates: 'شهادات غير صحيحة',
      },
      quickAccess: 'الوصول السريع',
      issueCertificate: 'إصدار شهادة',
      verifyCertificate: 'التحقق من شهادة',
      recentActivity: 'النشاط الأخير',
      noActivity: 'لا توجد عمليات تحقق بعد',
      viewMore: 'عرض المزيد',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      verificationHistory: 'سجل التحققات',
      timestamp: 'الوقت',
      certificateId: 'رقم الشهادة',
      result: 'النتيجة',
      valid: 'صحيحة',
      invalid: 'غير صحيحة',
      notFound: 'غير موجودة',
    },
    en: {
      greeting: 'Welcome, {name} 👋',
      welcome: 'Welcome to your dashboard',
      stats: {
        totalVerifications: 'Total Verifications',
        validCertificates: 'Valid Certificates',
        invalidCertificates: 'Invalid Certificates',
      },
      quickAccess: 'Quick Access',
      issueCertificate: 'Issue Certificate',
      verifyCertificate: 'Verify Certificate',
      recentActivity: 'Recent Activity',
      noActivity: 'No verification activities yet',
      viewMore: 'View More',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings',
      verificationHistory: 'Verification History',
      timestamp: 'Timestamp',
      certificateId: 'Certificate ID',
      result: 'Result',
      valid: 'Valid',
      invalid: 'Invalid',
      notFound: 'Not Found',
    },
  };

  const t = translations[language as keyof typeof translations];

  // حساب الإحصائيات
  const stats = {
    total: verificationHistory.length,
    valid: verificationHistory.filter((v) => v.verification_result === 'valid').length,
    invalid: verificationHistory.filter((v) => v.verification_result === 'invalid').length,
  };

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
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const recentVerifications = verificationHistory.slice(0, 5);

  return (
    <PageTransition>
      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div>
                <h1 className="dashboard-title">
                  {t.greeting.replace('{name}', profile?.full_name || 'المستخدم')}
                </h1>
                <p className="dashboard-subtitle">{t.welcome}</p>
              </div>

              {/* User Dropdown Menu */}
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="User menu"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="User Avatar" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <h3>{profile?.full_name}</h3>
                      <p>{profile?.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNavigate('/account')}
                    >
                      {t.profile}
                    </button>
                    <button className="dropdown-item" onClick={() => handleNavigate('/verification-history')}>
                      {t.verificationHistory}
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <FileCheck size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.stats.totalVerifications}</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon valid">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.stats.validCertificates}</p>
                <p className="stat-value">{stats.valid}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon invalid">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{t.stats.invalidCertificates}</p>
                <p className="stat-value">{stats.invalid}</p>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="quick-access-section">
            <h2 className="section-title">{t.quickAccess}</h2>
            <div className="quick-access-grid">
              <button
                className="quick-access-button issue"
                onClick={() => navigate('/issue')}
                aria-label="Issue certificate"
              >
                <span className="button-icon">📄</span>
                <span>{t.issueCertificate}</span>
              </button>

              <button
                className="quick-access-button verify"
                onClick={() => navigate('/verify')}
                aria-label="Verify certificate"
              >
                <span className="button-icon">✓</span>
                <span>{t.verifyCertificate}</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity-section">
            <div className="section-header">
              <h2 className="section-title">{t.recentActivity}</h2>
              {verificationHistory.length > 5 && (
                <button
                  className="view-more-btn"
                  onClick={() => navigate('/verification-history')}
                >
                  {t.viewMore} →
                </button>
              )}
            </div>

            {recentVerifications.length === 0 ? (
              <div className="empty-state">
                <p>{t.noActivity}</p>
              </div>
            ) : (
              <div className="activity-table">
                <div className="table-header">
                  <div className="table-cell">{t.certificateId}</div>
                  <div className="table-cell">{t.timestamp}</div>
                  <div className="table-cell">{t.result}</div>
                </div>
                <div className="table-body">
                  {recentVerifications.map((verification) => (
                    <div key={verification.id} className="table-row">
                      <div className="table-cell">
                        <code className="certificate-code">{verification.certificate_id.slice(0, 16)}...</code>
                      </div>
                      <div className="table-cell">
                        {new Date(verification.verified_at).toLocaleDateString(
                          language === 'ar' ? 'ar-SA' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </div>
                      <div className="table-cell">
                        <span
                          className={`result-badge ${verification.verification_result}`}
                        >
                          {verification.verification_result === 'valid'
                            ? t.valid
                            : verification.verification_result === 'invalid'
                              ? t.invalid
                              : t.notFound}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
