import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PageTransition } from '../components/PageTransition';
import { Chrome, Github, Zap, Shield, User, Lock } from 'lucide-react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, signInWithGitHub, signInWithMicrosoft, error, isLoading } = useAuth();
  const { login: adminLogin, isAuthenticated: isAdminAuth } = useAdmin();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [adminError, setAdminError] = useState('');

  // إعادة التوجيه للـ dashboard إذا كان المستخدم مسجل دخول
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    } else if (isAdminAuth) {
      navigate('/dashboard/home');
    }
  }, [user, isAdminAuth, navigate]);

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    await signInWithGoogle();
    setIsProcessing(false);
  };

  const handleGitHubSignIn = async () => {
    setIsProcessing(true);
    await signInWithGitHub();
    setIsProcessing(false);
  };

  const handleMicrosoftSignIn = async () => {
    setIsProcessing(true);
    await signInWithMicrosoft();
    setIsProcessing(false);
  };

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
      title: 'تسجيل الدخول الآمن',
      subtitle: 'استخدم حسابك في إحدى منصات التواصل الاجتماعي للدخول إلى النظام والبدء في التحقق من الشهادات',
      adminTitle: 'لوحة تحكم المشرفين',
      adminSubtitle: 'تسجيل دخول المشرفين لإدارة النظام وإصدار الشهادات',
      userMode: 'مستخدم عادي',
      adminMode: 'مشرف',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      adminLogin: 'دخول المشرف',
      signInWithGoogle: 'تسجيل الدخول عبر Google',
      signInWithGitHub: 'تسجيل الدخول عبر GitHub',
      signInWithMicrosoft: 'تسجيل الدخول عبر Microsoft',
      orContinueAsGuest: 'أو تابع كزائر',
      features: {
        title: 'المميزات المتوفرة:',
        items: [
          'تتبع سجل التحققات من الشهادات',
          'إصدار شهادات جديدة بسهولة',
          'حفظ وإدارة ملف المستخدم الشخصي',
          'الوصول السريع إلى أحدث العمليات',
        ],
      },
      adminFeatures: {
        title: 'صلاحيات المشرف:',
        items: [
          'إصدار وإدارة الشهادات بالكامل',
          'إدارة المشرفين وصلاحياتهم',
          'عرض تقارير وإحصائيات مفصلة',
          'مراقبة سجل التحققات الكامل',
        ],
      },
      verifyAsGuest: 'التحقق كزائر',
      error: 'حدث خطأ في تسجيل الدخول:',
    },
    en: {
      title: 'Secure Login',
      subtitle: 'Use your social media account to sign in to the system and start verifying certificates',
      adminTitle: 'Admin Control Panel',
      adminSubtitle: 'Admin login to manage system and issue certificates',
      userMode: 'Regular User',
      adminMode: 'Administrator',
      username: 'Username',
      password: 'Password',
      adminLogin: 'Admin Login',
      signInWithGoogle: 'Sign in with Google',
      signInWithGitHub: 'Sign in with GitHub',
      signInWithMicrosoft: 'Sign in with Microsoft',
      orContinueAsGuest: 'Or continue as guest',
      features: {
        title: 'Available Features:',
        items: [
          'Track certificate verification history',
          'Issue new certificates easily',
          'Save and manage your profile',
          'Quick access to recent activities',
        ],
      },
      adminFeatures: {
        title: 'Admin Privileges:',
        items: [
          'Full certificate issuance and management',
          'Manage administrators and permissions',
          'View detailed reports and statistics',
          'Monitor complete verification logs',
        ],
      },
      verifyAsGuest: 'Verify as Guest',
      error: 'Sign in error:',
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <PageTransition>
      <div className="login-page">
        <div className="login-container">
          {/* Mode Toggle */}
          <div className="login-mode-toggle">
            <button
              className={`mode-btn ${loginMode === 'user' ? 'active' : ''}`}
              onClick={() => setLoginMode('user')}
            >
              <User size={18} />
              <span>{t.userMode}</span>
            </button>
            <button
              className={`mode-btn ${loginMode === 'admin' ? 'active' : ''}`}
              onClick={() => setLoginMode('admin')}
            >
              <Shield size={18} />
              <span>{t.adminMode}</span>
            </button>
          </div>

          <div className="login-content">
            {/* Left Section - Info */}
            <div className="login-info">
              <div className="login-header">
                <h1 className="login-title">{loginMode === 'user' ? t.title : t.adminTitle}</h1>
                <p className="login-subtitle">{loginMode === 'user' ? t.subtitle : t.adminSubtitle}</p>
              </div>

              <div className="features-section">
                <h2 className="features-title">
                  {loginMode === 'user' ? t.features.title : t.adminFeatures.title}
                </h2>
                <ul className="features-list">
                  {(loginMode === 'user' ? t.features.items : t.adminFeatures.items).map((item: string, index: number) => (
                    <li key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section - Login Forms */}
            <div className="login-form">
              {loginMode === 'user' ? (
                <>
                  {error && (
                    <div className="error-message">
                      <span>{t.error}</span>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="oauth-buttons">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isProcessing || isLoading}
                      className="oauth-button google-btn"
                      aria-label="Sign in with Google"
                    >
                      <Chrome size={20} />
                      <span>{t.signInWithGoogle}</span>
                    </button>

                    <button
                      onClick={handleGitHubSignIn}
                      disabled={isProcessing || isLoading}
                      className="oauth-button github-btn"
                      aria-label="Sign in with GitHub"
                    >
                      <Github size={20} />
                      <span>{t.signInWithGitHub}</span>
                    </button>

                    <button
                      onClick={handleMicrosoftSignIn}
                      disabled={isProcessing || isLoading}
                      className="oauth-button microsoft-btn"
                      aria-label="Sign in with Microsoft"
                    >
                      <Zap size={20} />
                      <span>{t.signInWithMicrosoft}</span>
                    </button>
                  </div>

                  <div className="divider">
                    <span>{t.orContinueAsGuest}</span>
                  </div>

                  <button
                    onClick={() => navigate('/verify')}
                    className="guest-button"
                    aria-label="Verify as guest"
                  >
                    {t.verifyAsGuest}
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}

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
