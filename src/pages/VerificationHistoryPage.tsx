import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PageTransition } from '../components/PageTransition';
import { Search, Download } from 'lucide-react';
import './VerificationHistoryPage.css';

const VerificationHistoryPage: React.FC = () => {
  const { verificationHistory } = useAuth();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'valid' | 'invalid' | 'not_found'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc'>('date_desc');

  const translations = {
    ar: {
      title: 'سجل التحققات',
      subtitle: 'عرض جميع عمليات التحقق من الشهادات',
      search: 'البحث عن شهادة...',
      filter: 'التصفية',
      filterBy: 'التصفية حسب:',
      all: 'الكل',
      valid: 'شهادات صحيحة',
      invalid: 'شهادات غير صحيحة',
      notFound: 'شهادات غير موجودة',
      sort: 'ترتيب:',
      newestFirst: 'الأحدث أولاً',
      oldestFirst: 'الأقدم أولاً',
      noResults: 'لا توجد نتائج',
      certificateId: 'رقم الشهادة',
      timestamp: 'الوقت والتاريخ',
      result: 'النتيجة',
      actions: 'الإجراءات',
      download: 'تحميل',
      noHistory: 'لا يوجد سجل تحققات حتى الآن',
      noHistoryDesc: 'ابدأ بالتحقق من الشهادات لبناء سجل نشاطك',
      noHistoryAction: 'ابدأ التحقق',
      records: 'السجلات',
      recordsCount: '{count} سجل',
    },
    en: {
      title: 'Verification History',
      subtitle: 'View all certificate verification activities',
      search: 'Search for a certificate...',
      filter: 'Filter',
      filterBy: 'Filter By:',
      all: 'All',
      valid: 'Valid Certificates',
      invalid: 'Invalid Certificates',
      notFound: 'Not Found Certificates',
      sort: 'Sort:',
      newestFirst: 'Newest First',
      oldestFirst: 'Oldest First',
      noResults: 'No results found',
      certificateId: 'Certificate ID',
      timestamp: 'Timestamp',
      result: 'Result',
      actions: 'Actions',
      download: 'Download',
      noHistory: 'No verification history yet',
      noHistoryDesc: 'Start verifying certificates to build your activity record',
      noHistoryAction: 'Start Verifying',
      records: 'Records',
      recordsCount: '{count} records',
    },
  };

  const t = translations[language as keyof typeof translations];

  // Filtering and searching logic
  const filteredHistory = useMemo(() => {
    let result = verificationHistory;

    // Filter by result
    if (filterResult !== 'all') {
      result = result.filter((v) => v.verification_result === filterResult);
    }

    // Search by certificate ID or name
    if (searchTerm) {
      result = result.filter(
        (v) =>
          v.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (v.certificate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Sort
    if (sortBy === 'date_asc') {
      result.sort(
        (a, b) =>
          new Date(a.verified_at).getTime() - new Date(b.verified_at).getTime()
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.verified_at).getTime() - new Date(a.verified_at).getTime()
      );
    }

    return result;
  }, [verificationHistory, searchTerm, filterResult, sortBy]);

  const handleDownloadRecord = (record: any) => {
    const dataStr = JSON.stringify(record, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-${record.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="history-page">
        <div className="history-container">
          {/* Header */}
          <div className="history-header">
            <div>
              <h1 className="page-title">{t.title}</h1>
              <p className="page-subtitle">{t.subtitle}</p>
            </div>
            {filteredHistory.length > 0 && (
              <button className="download-all-button" onClick={handleDownloadAll}>
                <Download size={18} />
                <span>Export All</span>
              </button>
            )}
          </div>

          {/* Controls */}
          {verificationHistory.length > 0 && (
            <div className="controls-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-group">
                <div className="filter-control">
                  <label>{t.filterBy}</label>
                  <select
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="all">{t.all}</option>
                    <option value="valid">{t.valid}</option>
                    <option value="invalid">{t.invalid}</option>
                    <option value="not_found">{t.notFound}</option>
                  </select>
                </div>

                <div className="filter-control">
                  <label>{t.sort}</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="date_desc">{t.newestFirst}</option>
                    <option value="date_asc">{t.oldestFirst}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Table or Empty State */}
          {verificationHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h2>{t.noHistory}</h2>
              <p>{t.noHistoryDesc}</p>
              <button
                className="empty-state-button"
                onClick={() => (window.location.href = '/verify')}
              >
                {t.noHistoryAction}
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="no-results">
              <p>{t.noResults}</p>
            </div>
          ) : (
            <>
              <div className="records-info">
                <span>
                  {t.recordsCount.replace('{count}', filteredHistory.length.toString())}
                </span>
              </div>

              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>{t.certificateId}</th>
                      <th>{t.timestamp}</th>
                      <th>{t.result}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((record) => (
                      <tr key={record.id} className="table-row">
                        <td>
                          <code className="certificate-code">{record.certificate_id.slice(0, 24)}...</code>
                        </td>
                        <td>
                          {new Date(record.verified_at).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </td>
                        <td>
                          <span className={`result-badge ${record.verification_result}`}>
                            {record.verification_result === 'valid'
                              ? t.valid
                              : record.verification_result === 'invalid'
                                ? t.invalid
                                : t.notFound}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-button"
                            onClick={() => handleDownloadRecord(record)}
                            title={t.download}
                          >
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default VerificationHistoryPage;
