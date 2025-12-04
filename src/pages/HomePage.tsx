import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CheckCircle, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/PageTransition';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <PageTransition>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">{t('heroTitle')}</h1>
              <p className="hero-subtitle">{t('heroSubtitle')}</p>
              <div className="hero-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/issue')}
                >
                  {t('issueCert')}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/verify')}
                >
                  {t('verifyCert')}
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card card-1">
                <Shield size={32} />
                <p>{t('secure')}</p>
              </div>
              <div className="floating-card card-2">
                <Lock size={32} />
                <p>{t('immutable')}</p>
              </div>
              <div className="floating-card card-3">
                <CheckCircle size={32} />
                <p>{t('transparent')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">{t('howItWorks')}</h2>
            <p className="section-subtitle">{t('howItWorksDesc')}</p>

            <div className="steps-grid">
              {/* Step 1 */}
              <div className="step-card">
                <div className="step-number">01</div>
                <div className="step-icon">
                  <Zap size={40} />
                </div>
                <h3>{t('step1')}</h3>
                <p>{t('step1Desc')}</p>
              </div>

              {/* Arrow */}
              <div className="step-arrow">→</div>

              {/* Step 2 */}
              <div className="step-card">
                <div className="step-number">02</div>
                <div className="step-icon">
                  <Lock size={40} />
                </div>
                <h3>{t('step2')}</h3>
                <p>{t('step2Desc')}</p>
              </div>

              {/* Arrow */}
              <div className="step-arrow">→</div>

              {/* Step 3 */}
              <div className="step-card">
                <div className="step-number">03</div>
                <div className="step-icon">
                  <CheckCircle size={40} />
                </div>
                <h3>{t('step3')}</h3>
                <p>{t('step3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Blockchain Section */}
        <section className="why-blockchain">
          <div className="container">
            <h2 className="section-title">{t('whyBlockchain')}</h2>

            <div className="benefits-grid">
              {/* Benefit 1 */}
              <div className="benefit-card">
                <div className="benefit-icon icon-1">
                  <Shield size={40} />
                </div>
                <h3>{t('secure')}</h3>
                <p>{t('secureDesc')}</p>
              </div>

              {/* Benefit 2 */}
              <div className="benefit-card">
                <div className="benefit-icon icon-2">
                  <Lock size={40} />
                </div>
                <h3>{t('transparent')}</h3>
                <p>{t('transparentDesc')}</p>
              </div>

              {/* Benefit 3 */}
              <div className="benefit-card">
                <div className="benefit-icon icon-3">
                  <CheckCircle size={40} />
                </div>
                <h3>{t('immutable')}</h3>
                <p>{t('immutableDesc')}</p>
              </div>

              {/* Benefit 4 */}
              <div className="benefit-card">
                <div className="benefit-icon icon-4">
                  <Zap size={40} />
                </div>
                <h3>{t('decentralized')}</h3>
                <p>{t('decentralizedDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container cta-container">
            <h2>{language === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}</h2>
            <p>
              {language === 'ar'
                ? 'انضم إلى آلاف المستخدمين الذين يثقون بنظامنا للتحقق من الشهادات'
                : 'Join thousands of users who trust our system for certificate verification'}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/issue')}>
              {t('issueCert')}
            </button>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;
