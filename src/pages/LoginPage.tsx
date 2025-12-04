import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PageTransition } from '../components/PageTransition';
import { Shield, User, Lock } from 'lucide-react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { login: adminLogin, isAuthenticated: isAdminAuth } = useAdmin();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [adminError, setAdminError] = useState('');

  // إعادة التوجيه للـ dashboard إذا كان المشرف مسجل دخول
  useEffect(() => {
    if (isAdminAuth) {
      navigate('/dashboard/home');
    }
  }, [isAdminAuth, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    
    if (!adminCredentials.username || !adminCredentials.password) {
      setAdminError(language === 'ar' ? 'الرجاء إدخال اسم المستخدم وكلمة المرور' : 'Please enter username and password');
      return;
    }

    setIsProcessing(true);
    const result = await adminLogin(adminCredentials);
    setIsProcessing(false);

    if (!result.success) {
      setAdminError(result.error || 'Login failed');
    }
  };

  const translations = {
    ar: {
      title: 'لوحة تحكم المشرفين',
      subtitle: 'تسجيل دخول المشرفين لإدارة النظام وإصدار الشهادات',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      adminLogin: 'دخول المشرف',
      features: {
        title: 'صلاحيات المشرف:',
        items: [
          'إصدار وإدارة الشهادات بالكامل',
          'إدارة المشرفين وصلاحياتهم',
          'عرض تقارير وإحصائيات مفصلة',
          'مراقبة سجل التحققات الكامل',
        ],
      },
    },
    en: {
      title: 'Admin Control Panel',
      subtitle: 'Admin login to manage system and issue certificates',
      username: 'Username',
      password: 'Password',
      adminLogin: 'Admin Login',
      features: {
        title: 'Admin Privileges:',
        items: [
          'Full certificate issuance and management',
          'Manage administrators and permissions',
          'View detailed reports and statistics',
          'Monitor complete verification logs',
        ],
      },
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <PageTransition>
      <div className="login-page">
        <div className="login-container">
          <div className="login-content">
            {/* Left Section - Info */}
            <div className="login-info">
              <div className="login-header">
                <h1 className="login-title">{t.title}</h1>
                <p className="login-subtitle">{t.subtitle}</p>
              </div>

              <div className="features-section">
                <h2 className="features-title">{t.features.title}</h2>
                <ul className="features-list">
                  {t.features.items.map((item: string, index: number) => (
                    <li key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section - Admin Login Form */}
            <div className="login-form">
              {adminError && (
                <div className="error-message">
                  <p>{adminError}</p>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="admin-form">
                <div className="form-group">
                  <label htmlFor="username">
                    <User size={16} />
                    <span>{t.username}</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    placeholder={t.username}
                    disabled={isProcessing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <Lock size={16} />
                    <span>{t.password}</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    placeholder={t.password}
                    disabled={isProcessing}
                  />
                </div>

                <button
                  type="submit"
                  className="admin-login-btn"
                  disabled={isProcessing}
                >
                  <Shield size={18} />
                  <span>{t.adminLogin}</span>
                </button>
              </form>

              <div className="loading-indicator" style={{ opacity: isProcessing ? 1 : 0 }}>
                <p>{language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
