import React, { useState } from 'react';
import { Upload, Copy, Check, Loader } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/PageTransition';
import { CertificateService, type Certificate } from '../utils/certificateService';
import './IssueCertificatePage.css';

export const IssueCertificatePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [issuedCertificate, setIssuedCertificate] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    studentID: '',
    specialization: '',
    graduationYear: new Date().getFullYear(),
    pdfFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        pdfFile: files[0],
      }));
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({
        ...prev,
        pdfFile: e.dataTransfer.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.studentName || !formData.studentID || !formData.specialization || !formData.pdfFile) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const certificate = CertificateService.issueCertificate({
        studentName: formData.studentName,
        studentID: formData.studentID,
        specialization: formData.specialization,
        graduationYear: formData.graduationYear,
      });

      setIssuedCertificate(certificate);
      setLoading(false);

      // Reset form
      setFormData({
        studentName: '',
        studentID: '',
        specialization: '',
        graduationYear: new Date().getFullYear(),
        pdfFile: null,
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    if (issuedCertificate) {
      navigator.clipboard.writeText(issuedCertificate.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageTransition>
      <div className="issue-certificate-page">
        <div className="page-container">
          <h1 className="page-title">{t('issueCertTitle')}</h1>

          <div className="issue-content">
            {/* Form Section */}
            {!issuedCertificate ? (
              <div className="form-section">
                <form onSubmit={handleSubmit} className="certificate-form">
                  {/* Row 1 */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="studentName">{t('studentName')}</label>
                      <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder={language === 'ar' ? 'أدخل اسم الطالب' : 'Enter student name'}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="studentID">{t('studentID')}</label>
                      <input
                        type="text"
                        id="studentID"
                        name="studentID"
                        value={formData.studentID}
                        onChange={handleInputChange}
                        placeholder={language === 'ar' ? 'أدخل رقم الطالب' : 'Enter student ID'}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="specialization">{t('specialization')}</label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder={language === 'ar' ? 'أدخل التخصص' : 'Enter specialization'}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="graduationYear">{t('graduationYear')}</label>
                      <select
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                      >
                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="form-group full-width">
                    <label>{t('uploadPDF')}</label>
                    <div
                      className="file-upload"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDragDrop}
                    >
                      <input
                        type="file"
                        id="pdfFile"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="pdfFile" className="file-upload-label">
                        <Upload size={40} />
                        <p>{t('dragDrop')}</p>
                        {formData.pdfFile && <p className="file-name">{formData.pdfFile.name}</p>}
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader size={20} className="spinner" />
                        {t('loading')}
                      </>
                    ) : (
                      t('issueCertBtn')
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Success Section */
              <div className="success-section">
                <div className="success-header">
                  <div className="success-icon">✓</div>
                  <h2>{t('success')}</h2>
                </div>

                <div className="certificate-info">
                  <div className="info-card">
                    <h3>{t('certificateID')}</h3>
                    <div className="id-display">
                      <code>{issuedCertificate.id}</code>
                      <button className="copy-btn" onClick={copyToClipboard} title={t('copyID')}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="info-card">
                    <h3>{t('studentName')}</h3>
                    <p>{issuedCertificate.studentName}</p>
                  </div>

                  <div className="info-card">
                    <h3>{t('specialization')}</h3>
                    <p>{issuedCertificate.specialization}</p>
                  </div>

                  <div className="info-card">
                    <h3>{t('graduationYear')}</h3>
                    <p>{issuedCertificate.graduationYear}</p>
                  </div>

                  <div className="info-card">
                    <h3>{t('issuedDate')}</h3>
                    <p>{issuedCertificate.issueDate}</p>
                  </div>

                  <div className="info-card full-width">
                    <h3>{t('ipfsCID')}</h3>
                    <code className="full-code">{issuedCertificate.ipfsCID}</code>
                  </div>
                </div>

                <div className="qr-section">
                  <h3>{language === 'ar' ? 'رمز QR' : 'QR Code'}</h3>
                  <div className="qr-container">
                    <QRCode
                      value={issuedCertificate.id}
                      size={256}
                      bgColor="#ffffff"
                      fgColor="#5d3fd3"
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="qr-hint">
                    {language === 'ar'
                      ? 'امسح رمز QR للتحقق من الشهادة'
                      : 'Scan QR code to verify certificate'}
                  </p>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIssuedCertificate(null);
                  }}
                >
                  {language === 'ar' ? 'إصدار شهادة جديدة' : 'Issue Another Certificate'}
                </button>
              </div>
            )}

            {/* Info Panel */}
            <div className="info-panel">
              <h3>{language === 'ar' ? 'معلومات' : 'Information'}</h3>
              <ul>
                <li>{language === 'ar' ? '✓ البيانات محفوظة بأمان على البلوكشين' : '✓ Data is securely stored on blockchain'}</li>
                <li>{language === 'ar' ? '✓ الملف محفوظ على IPFS' : '✓ File is stored on IPFS'}</li>
                <li>
                  {language === 'ar'
                    ? '✓ لا يمكن تعديل الشهادة بعد الإصدار'
                    : '✓ Certificate cannot be modified after issuance'}
                </li>
                <li>
                  {language === 'ar'
                    ? '✓ يمكن التحقق من الشهادة في أي وقت'
                    : '✓ Certificate can be verified anytime'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default IssueCertificatePage;
