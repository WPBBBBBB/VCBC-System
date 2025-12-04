import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, HelpCircle, ExternalLink, History, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { supabase } from '../services/supabase';
import './VerifyCertificatePage.css';

type VerificationStatus = null | 'valid' | 'notfound';

interface Certificate {
  id: string;
  student_name: string;
  student_id: string;
  department: string;
  graduation_year: number;
  hash: string;
  issued_at: string;
  pdf_url?: string;
}

interface VerificationRecord {
  id: string;
  certificate_id: string;
  result: string;
  verified_at: string;
  certificate?: Certificate;
}

export const VerifyCertificatePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [certificateID, setCertificateID] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [recentVerifications, setRecentVerifications] = useState<VerificationRecord[]>([]);

  useEffect(() => {
    if (user) {
      loadRecentVerifications();
    }
  }, [user]);

  const loadRecentVerifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('verification_history')
        .select(`
          id,
          certificate_id,
          result,
          verified_at,
          certificate:certificates(*)
        `)
        .eq('verified_by', user.id)
        .order('verified_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentVerifications(data as any);
      }
    } catch (error) {
      console.error('Error loading verifications:', error);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateID.trim()) {
      alert(language === 'ar' ? 'يرجى إدخال معرّف الشهادة' : 'Please enter certificate ID');
      return;
    }

    setLoading(true);

    try {
      // البحث عن الشهادة في قاعدة البيانات
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', certificateID.trim())
        .single();

      if (error || !data) {
        setCertificate(null);
        setStatus('notfound');
      } else {
        setCertificate(data);
        setStatus('valid');
      }

      // حفظ سجل التحقق إذا كان المستخدم مسجل دخول
      if (user) {
        await supabase.from('verification_history').insert({
          certificate_id: certificateID.trim(),
          verified_by: user.id,
          result: data ? 'valid' : 'not_found',
        });
        loadRecentVerifications();
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setCertificate(null);
      setStatus('notfound');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertificateID('');
    setStatus(null);
    setCertificate(null);
  };

  return (
    <PageTransition>
      <div className="verify-certificate-page">
        <div className="page-container">
          <h1 className="page-title">{t('verifyCertTitle')}</h1>

          <div className="verify-content">
            {/* Search Section */}
            <div className="search-section">
              <form onSubmit={handleVerify} className="verify-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={certificateID}
                    onChange={(e) => setCertificateID(e.target.value)}
                    placeholder={t('enterCertID')}
                    className="verify-input"
                    disabled={loading}
                  />
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        {t('loading')}
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        {t('verifyCertBtn')}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status Display */}
              {status && (
                <div className={`status-container status-${status}`}>
                  {status === 'valid' && (
                    <div className="status-display">
                      <div className="status-icon valid-icon">
                        <CheckCircle size={64} />
                      </div>
                      <h2 className="status-title">{t('certificateValid')}</h2>
                      <p className="status-message">
                        {language === 'ar'
                          ? 'هذه الشهادة أصلية وموثقة على البلوكشين'
                          : 'This certificate is authentic and verified on blockchain'}
                      </p>
                    </div>
                  )}

                  {status === 'notfound' && (
                    <div className="status-display">
                      <div className="status-icon notfound-icon">
                        <HelpCircle size={64} />
                      </div>
                      <h2 className="status-title">{t('certificateNotFound')}</h2>
                      <p className="status-message">
                        {language === 'ar'
                          ? 'لم يتم العثور على هذه الشهادة في النظام'
                          : 'This certificate was not found in the system'}
                      </p>
                    </div>
                  )}

                  {/* Certificate Details */}
                  {certificate && status === 'valid' && (
                    <div className="certificate-details">
                      <h3>{language === 'ar' ? 'تفاصيل الشهادة' : 'Certificate Details'}</h3>
                      <div className="details-grid">
                        <div className="detail-card">
                          <span className="detail-label">{language === 'ar' ? 'اسم الطالب' : 'Student Name'}</span>
                          <span className="detail-value">{certificate.student_name}</span>
                        </div>
                        <div className="detail-card">
                          <span className="detail-label">{language === 'ar' ? 'رقم الطالب' : 'Student ID'}</span>
                          <span className="detail-value">{certificate.student_id}</span>
                        </div>
                        <div className="detail-card">
                          <span className="detail-label">{language === 'ar' ? 'القسم' : 'Department'}</span>
                          <span className="detail-value">{certificate.department}</span>
                        </div>
                        <div className="detail-card">
                          <span className="detail-label">{language === 'ar' ? 'سنة التخرج' : 'Graduation Year'}</span>
                          <span className="detail-value">{certificate.graduation_year}</span>
                        </div>
                        <div className="detail-card">
                          <span className="detail-label">{language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</span>
                          <span className="detail-value">
                            {new Date(certificate.issued_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                        <div className="detail-card">
                          <span className="detail-label">{language === 'ar' ? 'معرف الشهادة' : 'Certificate ID'}</span>
                          <code className="cert-id">{certificate.id}</code>
                        </div>
                        {certificate.pdf_url && (
                          <div className="detail-card full-width">
                            <a 
                              href={certificate.pdf_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pdf-link"
                            >
                              <ExternalLink size={18} />
                              <span>{language === 'ar' ? 'عرض ملف PDF' : 'View PDF'}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button className="btn btn-primary reset-btn" onClick={handleReset}>
                    {language === 'ar' ? 'التحقق من شهادة أخرى' : 'Verify Another Certificate'}
                  </button>
                </div>
              )}
            </div>

            {/* Recent Verifications */}
            {user && recentVerifications.length > 0 && !status && (
              <div className="recent-verifications">
                <div className="section-header">
                  <History size={24} />
                  <h2>{language === 'ar' ? 'عمليات التحقق الأخيرة' : 'Recent Verifications'}</h2>
                </div>
                <div className="verification-list">
                  {recentVerifications.map((record) => (
                    <div key={record.id} className="verification-item">
                      <div className="verification-icon">
                        {record.result === 'valid' ? (
                          <CheckCircle size={20} className="icon-valid" />
                        ) : (
                          <XCircle size={20} className="icon-notfound" />
                        )}
                      </div>
                      <div className="verification-info">
                        <div className="verification-id">{record.certificate_id}</div>
                        <div className="verification-meta">
                          <Clock size={14} />
                          <span>{new Date(record.verified_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                        </div>
                      </div>
                      <button
                        className="btn-verify-again"
                        onClick={() => {
                          setCertificateID(record.certificate_id);
                          handleVerify(new Event('submit') as any);
                        }}
                      >
                        {language === 'ar' ? 'إعادة التحقق' : 'Verify Again'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Information Panel */}
            {!status && (
              <div className="info-section">
                <h2>{language === 'ar' ? 'كيفية التحقق' : 'How to Verify'}</h2>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <h3>{language === 'ar' ? 'احصل على معرّف الشهادة' : 'Get Certificate ID'}</h3>
                    <p>
                      {language === 'ar'
                        ? 'احصل على معرّف الشهادة من صاحب الشهادة أو من البريد الإلكتروني'
                        : 'Get the certificate ID from the certificate owner or email'}
                    </p>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <h3>{language === 'ar' ? 'أدخل المعرّف' : 'Enter the ID'}</h3>
                    <p>
                      {language === 'ar'
                        ? 'أدخل معرّف الشهادة في حقل البحث أعلاه'
                        : 'Enter the certificate ID in the search field above'}
                    </p>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <h3>{language === 'ar' ? 'عرض النتائج' : 'View Results'}</h3>
                    <p>
                      {language === 'ar'
                        ? 'سترى حالة الشهادة وجميع تفاصيلها'
                        : 'You will see the certificate status and all details'}
                    </p>
                  </div>
                </div>

                <div className="verification-note">
                  <h3>{language === 'ar' ? 'ملاحظة' : 'Note'}</h3>
                  <p>
                    {language === 'ar'
                      ? 'يمكنك الحصول على معرف الشهادة من المستند الأصلي أو من خلال مسح رمز QR المرفق مع الشهادة'
                      : 'You can get the certificate ID from the original document or by scanning the QR code attached to the certificate'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyCertificatePage;
