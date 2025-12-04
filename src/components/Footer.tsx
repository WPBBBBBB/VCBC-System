import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3>{language === 'ar' ? 'عن النظام' : 'About'}</h3>
            <p>
              {language === 'ar'
                ? 'نظام متقدم للتحقق من الشهادات باستخدام تقنية البلوكشين والتخزين الموزع'
                : 'An advanced system for certificate verification using blockchain and distributed storage'}
            </p>
          </div>

          {/* Features Section */}
          <div className="footer-section">
            <h3>{language === 'ar' ? 'المميزات' : 'Features'}</h3>
            <ul>
              <li>{t('secure')}</li>
              <li>{t('transparent')}</li>
              <li>{t('immutable')}</li>
              <li>{t('decentralized')}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
