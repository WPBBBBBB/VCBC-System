import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../services/supabase';
import { FileText, Upload, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode.react';
import './IssueCertificate.css';

interface IssuedCertificate {
  id: string;
  student_name: string;
  student_id: string;
  department: string;
  graduation_year: number;
  hash: string;
  ipfs_cid: string;
  issued_at: string;
}

export const IssueCertificate: React.FC = () => {
  const { admin } = useAdmin();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [issuedCertificate, setIssuedCertificate] = useState<IssuedCertificate | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedIpfs, setCopiedIpfs] = useState(false);
  
  const [formData, setFormData] = useState({
    student_name: '',
    student_id: '',
    department: '',
    graduation_year: new Date().getFullYear(),
    pdf_url: '',
  });

  const translations = {
    ar: {
      title: 'إصدار شهادة جديدة',
      studentName: 'اسم الطالب',
      studentId: 'رقم الطالب',
      department: 'القسم',
      graduationYear: 'سنة التخرج',
      pdfUrl: 'رابط ملف PDF (اختياري)',
      issue: 'إصدار الشهادة',
      cancel: 'إلغاء',
      success: 'تم إصدار الشهادة بنجاح!',
      error: 'حدث خطأ أثناء إصدار الشهادة',
      required: 'هذا الحقل مطلوب',
      certificateID: 'معرف الشهادة',
      ipfsCID: 'معرف IPFS',
      qrCode: 'رمز QR',
      scanQR: 'امسح رمز QR للتحقق من الشهادة',
      copyID: 'نسخ المعرف',
      issuedDate: 'تاريخ الإصدار',
      issueAnother: 'إصدار شهادة جديدة',
      certificateHash: 'Hash الشهادة',
    },
    en: {
      title: 'Issue New Certificate',
      studentName: 'Student Name',
      studentId: 'Student ID',
      department: 'Department',
      graduationYear: 'Graduation Year',
      pdfUrl: 'PDF URL (optional)',
      issue: 'Issue Certificate',
      cancel: 'Cancel',
      success: 'Certificate issued successfully!',
      error: 'Error issuing certificate',
      required: 'This field is required',
      certificateID: 'Certificate ID',
      ipfsCID: 'IPFS CID',
      qrCode: 'QR Code',
      scanQR: 'Scan QR code to verify certificate',
      copyID: 'Copy ID',
      issuedDate: 'Issued Date',
      issueAnother: 'Issue Another Certificate',
      certificateHash: 'Certificate Hash',
    },
  };

  const t = translations[language as keyof typeof translations];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_name || !formData.student_id || !formData.department) {
      setMessage({ type: 'error', text: t.required });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Generate hash using Supabase function
      const { data: hashData, error: hashError } = await supabase
        .rpc('generate_certificate_hash', {
          p_student_id: formData.student_id,
          p_student_name: formData.student_name,
          p_department: formData.department,
        });

      if (hashError) throw hashError;

      // Generate mock IPFS CID (in production, upload to IPFS)
      const ipfsCID = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Insert certificate
      const { data: insertData, error: insertError } = await supabase
        .from('certificates')
        .insert({
          student_name: formData.student_name,
          student_id: formData.student_id,
          department: formData.department,
          graduation_year: formData.graduation_year,
          pdf_url: formData.pdf_url || null,
          hash: hashData,
          issued_by: admin?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Set issued certificate data
      setIssuedCertificate({
        id: insertData.id,
        student_name: insertData.student_name,
        student_id: insertData.student_id,
        department: insertData.department,
        graduation_year: insertData.graduation_year,
        hash: insertData.hash,
        ipfs_cid: ipfsCID,
        issued_at: insertData.issued_at,
      });

      setMessage({ type: 'success', text: t.success });
      
      // Reset form
      setFormData({
        student_name: '',
        student_id: '',
        department: '',
        graduation_year: new Date().getFullYear(),
        pdf_url: '',
      });
    } catch (error) {
      console.error('Error issuing certificate:', error);
      setMessage({ type: 'error', text: (error as Error).message || t.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      student_name: '',
      student_id: '',
      department: '',
      graduation_year: new Date().getFullYear(),
      pdf_url: '',
    });
    setMessage(null);
  };

  const copyToClipboard = (text: string, type: 'id' | 'ipfs') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedIpfs(true);
      setTimeout(() => setCopiedIpfs(false), 2000);
    }
  };

  return (
    <div className="issue-certificate-page">
      <div className="page-header">
        <div className="header-content">
          <FileText size={32} />
          <h1>{t.title}</h1>
        </div>
      </div>

      {!issuedCertificate ? (
        <>
          {message && message.type === 'error' && (
            <div className={`alert alert-${message.type}`}>
              <AlertCircle size={20} />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="certificate-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="student_name">{t.studentName} *</label>
            <input
              type="text"
              id="student_name"
              value={formData.student_name}
              onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              required
              disabled={isSubmitting}
              placeholder={t.studentName}
            />
          </div>

          <div className="form-group">
            <label htmlFor="student_id">{t.studentId} *</label>
            <input
              type="text"
              id="student_id"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              required
              disabled={isSubmitting}
              placeholder={t.studentId}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">{t.department} *</label>
            <input
              type="text"
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              disabled={isSubmitting}
              placeholder={t.department}
            />
          </div>

          <div className="form-group">
            <label htmlFor="graduation_year">{t.graduationYear} *</label>
            <input
              type="number"
              id="graduation_year"
              value={formData.graduation_year}
              onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
              required
              disabled={isSubmitting}
              min="2000"
              max="2100"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pdf_url">
            <Upload size={16} />
            <span>{t.pdfUrl}</span>
          </label>
          <input
            type="url"
            id="pdf_url"
            value={formData.pdf_url}
            onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
            disabled={isSubmitting}
            placeholder="https://example.com/certificate.pdf"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn-secondary" disabled={isSubmitting}>
            {t.cancel}
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? '...' : t.issue}
          </button>
        </div>
      </form>
        </>
      ) : (
        /* Success Section */
        <div className="success-section">
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2>{t.success}</h2>
          </div>

          <div className="certificate-details">
            <div className="details-grid">
              {/* Certificate ID */}
              <div className="detail-card">
                <h3>{t.certificateID}</h3>
                <div className="copy-field">
                  <code>{issuedCertificate.id}</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(issuedCertificate.id, 'id')}
                    title={t.copyID}
                  >
                    {copiedId ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* IPFS CID */}
              <div className="detail-card">
                <h3>{t.ipfsCID}</h3>
                <div className="copy-field">
                  <code className="ipfs-code">{issuedCertificate.ipfs_cid}</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(issuedCertificate.ipfs_cid, 'ipfs')}
                    title={t.copyID}
                  >
                    {copiedIpfs ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Student Name */}
              <div className="detail-card">
                <h3>{t.studentName}</h3>
                <p>{issuedCertificate.student_name}</p>
              </div>

              {/* Student ID */}
              <div className="detail-card">
                <h3>{t.studentId}</h3>
                <p>{issuedCertificate.student_id}</p>
              </div>

              {/* Department */}
              <div className="detail-card">
                <h3>{t.department}</h3>
                <p>{issuedCertificate.department}</p>
              </div>

              {/* Graduation Year */}
              <div className="detail-card">
                <h3>{t.graduationYear}</h3>
                <p>{issuedCertificate.graduation_year}</p>
              </div>

              {/* Issued Date */}
              <div className="detail-card">
                <h3>{t.issuedDate}</h3>
                <p>{new Date(issuedCertificate.issued_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
              </div>

              {/* Certificate Hash */}
              <div className="detail-card full-width">
                <h3>{t.certificateHash}</h3>
                <code className="hash-code">{issuedCertificate.hash}</code>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="qr-section">
              <h3>{t.qrCode}</h3>
              <div className="qr-container">
                <QRCode
                  value={issuedCertificate.id}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#6b72ff"
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="qr-hint">{t.scanQR}</p>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              setIssuedCertificate(null);
              setMessage(null);
            }}
          >
            {t.issueAnother}
          </button>
        </div>
      )}
    </div>
  );
};
