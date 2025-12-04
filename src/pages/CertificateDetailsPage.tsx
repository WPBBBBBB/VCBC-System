import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, ExternalLink, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/PageTransition';
import { CertificateService, type Certificate } from '../utils/certificateService';
import './CertificateDetailsPage.css';

export const CertificateDetailsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const certId = searchParams.get('id');
    if (certId) {
      setTimeout(() => {
        const result = CertificateService.verifyCertificate(certId);
        setCertificate(result);
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    // Placeholder for PDF download functionality
    alert(language === 'ar' ? 'سيتم تنزيل ملف PDF قريباً' : 'PDF download will be available soon');
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="certificate-details-page">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!certificate) {
    return (
      <PageTransition>
        <div className="certificate-details-page">
          <div className="page-container">
            <div className="error-message">
              <h2>{language === 'ar' ? 'الشهادة غير موجودة' : 'Certificate Not Found'}</h2>
              <p>
                {language === 'ar'
                  ? 'يرجى التحقق من معرّف الشهادة وحاول مجدداً'
                  : 'Please verify the certificate ID and try again'}
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="certificate-details-page">
        <div className="page-container">
          <h1 className="page-title">{t('certificateDetailsTitle')}</h1>

          <div className="details-layout">
            {/* Main Certificate Card */}
            <div className="certificate-card">
              {/* Header */}
              <div className="card-header">
                <div className="header-badge">
                  <span className={`badge ${certificate.isValid ? 'valid' : 'invalid'}`}>
                    {certificate.isValid ? '✓ VALID' : '✗ INVALID'}
                  </span>
                </div>
                <h2>{language === 'ar' ? 'شهادة التخرج' : 'Certificate of Graduation'}</h2>
              </div>

              {/* Divider */}
              <div className="card-divider"></div>

              {/* Student Information */}
              <div className="info-section">
                <h3>{language === 'ar' ? 'معلومات الطالب' : 'Student Information'}</h3>
                <div className="info-grid">
                  <div className="info-row">
                    <span className="info-label">{t('name')}</span>
                    <span className="info-value">{certificate.studentName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('studentID')}</span>
                    <span className="info-value">{certificate.studentID}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('major')}</span>
                    <span className="info-value">{certificate.specialization}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('year')}</span>
                    <span className="info-value">{certificate.graduationYear}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="card-divider"></div>

              {/* Certificate Information */}
              <div className="info-section">
                <h3>{language === 'ar' ? 'معلومات الشهادة' : 'Certificate Information'}</h3>
                <div className="info-grid">
                  <div className="info-row">
                    <span className="info-label">{t('certificateID')}</span>
                    <div className="info-value-with-copy">
                      <code>{certificate.id}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(certificate.id)}
                        title={t('copyID')}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('issuedDate')}</span>
                    <span className="info-value">{certificate.issueDate}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="card-divider"></div>

              {/* Blockchain Information */}
              <div className="info-section">
                <h3>{language === 'ar' ? 'معلومات البلوكشين' : 'Blockchain Information'}</h3>
                <div className="blockchain-info">
                  <div className="blockchain-item">
                    <span className="blockchain-label">{t('ipfsCID')}</span>
                    <div className="blockchain-value">
                      <code>{certificate.ipfsCID}</code>
                      <a
                        href={`https://ipfs.io/ipfs/${certificate.ipfsCID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blockchain-link"
                        title={language === 'ar' ? 'فتح على IPFS' : 'Open on IPFS'}
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>

                  <div className="blockchain-item">
                    <span className="blockchain-label">{t('blockchainHash')}</span>
                    <div className="blockchain-value">
                      <code>{certificate.blockchainHash}</code>
                      <button
                        className="blockchain-link copy-btn"
                        onClick={() => copyToClipboard(certificate.blockchainHash)}
                        title={language === 'ar' ? 'نسخ البصمة' : 'Copy Hash'}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary verify-blockchain">
                  {t('verifyOnBlockchain')}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="details-sidebar">
              {/* QR Code */}
              <div className="qr-card">
                <h3>{language === 'ar' ? 'رمز QR' : 'QR Code'}</h3>
                <div className="qr-container">
                  <QRCode
                    value={certificate.id}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#5d3fd3"
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-hint">
                  {language === 'ar'
                    ? 'امسح رمز QR للتحقق من الشهادة'
                    : 'Scan QR code to verify'}
                </p>
              </div>

              {/* Actions */}
              <div className="actions-card">
                <h3>{language === 'ar' ? 'الإجراءات' : 'Actions'}</h3>
                <button className="btn btn-primary download-btn" onClick={downloadPDF}>
                  <Download size={20} />
                  {t('downloadPDF')}
                </button>
                <button className="btn btn-secondary">
                  {language === 'ar' ? 'طباعة' : 'Print'}
                </button>
              </div>

              {/* Certificate Status */}
              <div className="status-card">
                <h3>{language === 'ar' ? 'الحالة' : 'Status'}</h3>
                <div className={`status-badge ${certificate.isValid ? 'valid' : 'invalid'}`}>
                  {certificate.isValid ? (
                    <>
                      <span className="status-dot"></span>
                      <span>{language === 'ar' ? 'صحيحة' : 'Valid'}</span>
                    </>
                  ) : (
                    <>
                      <span className="status-dot"></span>
                      <span>{language === 'ar' ? 'مزورة' : 'Invalid'}</span>
                    </>
                  )}
                </div>
                <p className="status-note">
                  {certificate.isValid
                    ? language === 'ar'
                      ? 'هذه الشهادة موثقة على البلوكشين'
                      : 'This certificate is verified on blockchain'
                    : language === 'ar'
                      ? 'هذه الشهادة مزورة أو ملغاة'
                      : 'This certificate is fraudulent or revoked'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CertificateDetailsPage;
