import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, type Certificate } from '../../services/supabase';
import { FolderOpen, Search, Edit2, Trash2, Eye, Download } from 'lucide-react';
import './IssuedCertificates.css';

export const IssuedCertificates: React.FC = () => {
  const { language } = useLanguage();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = certificates.filter(
        (cert) =>
          cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCertificates(filtered);
    } else {
      setFilteredCertificates(certificates);
    }
  }, [searchTerm, certificates]);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          managers!certificates_issued_by_fkey(name)
        `)
        .order('issued_at', { ascending: false });

      if (!error && data) {
        const formattedData = data.map((cert: Certificate & { managers?: { name: string } }) => ({
          ...cert,
          issued_by_name: cert.managers?.name || 'Unknown',
        }));
        setCertificates(formattedData);
        setFilteredCertificates(formattedData);
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'ar' ? 'هل تريد حذف هذه الشهادة؟' : 'Delete this certificate?')) {
      return;
    }

    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (!error) {
        loadCertificates();
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const translations = {
    ar: {
      title: 'الشهادات المصدرة',
      search: 'بحث...',
      studentName: 'اسم الطالب',
      studentId: 'رقم الطالب',
      department: 'القسم',
      year: 'السنة',
      issuedBy: 'صادرة من',
      hash: 'Hash',
      actions: 'الإجراءات',
      noData: 'لا توجد شهادات',
      loading: 'جاري التحميل...',
      total: 'إجمالي',
    },
    en: {
      title: 'Issued Certificates',
      search: 'Search...',
      studentName: 'Student Name',
      studentId: 'Student ID',
      department: 'Department',
      year: 'Year',
      issuedBy: 'Issued By',
      hash: 'Hash',
      actions: 'Actions',
      noData: 'No certificates found',
      loading: 'Loading...',
      total: 'Total',
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="issued-certificates-page">
      <div className="page-header">
        <div className="header-content">
          <FolderOpen size={32} />
          <div>
            <h1>{t.title}</h1>
            <p className="count-badge">
              {t.total}: {filteredCertificates.length}
            </p>
          </div>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="certificates-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : filteredCertificates.length > 0 ? (
          <div className="table-wrapper">
            <table className="certificates-table">
              <thead>
                <tr>
                  <th>{t.studentName}</th>
                  <th>{t.studentId}</th>
                  <th>{t.department}</th>
                  <th>{t.year}</th>
                  <th>{t.issuedBy}</th>
                  <th>{t.hash}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id}>
                    <td className="student-name">{cert.student_name}</td>
                    <td className="student-id">{cert.student_id}</td>
                    <td>{cert.department}</td>
                    <td>{cert.graduation_year}</td>
                    <td>{cert.issued_by_name}</td>
                    <td>
                      <code className="hash-code">{cert.hash?.substring(0, 12)}...</code>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="View">
                          <Eye size={16} />
                        </button>
                        {cert.pdf_url && (
                          <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="action-btn download-btn" title="Download">
                            <Download size={16} />
                          </a>
                        )}
                        <button className="action-btn edit-btn" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(cert.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <FolderOpen size={64} />
            <p>{t.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
};
