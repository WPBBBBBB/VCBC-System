import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, type VerificationRecord } from '../../services/supabase';
import { History, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './VerificationHistory.css';

export const VerificationHistory: React.FC = () => {
  const { language } = useLanguage();
  const [history, setHistory] = useState<VerificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('verification_history')
        .select('*')
        .order('verified_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }
    } catch (error) {
      console.error('Error loading verification history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter((record) => {
    const matchesSearch = 
      record.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.verified_by && record.verified_by.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterResult === 'all' || record.result === filterResult;
    
    return matchesSearch && matchesFilter;
  });

  const translations = {
    ar: {
      title: 'سجل التحققات',
      search: 'بحث...',
      all: 'الكل',
      valid: 'صحيحة',
      invalid: 'غير صحيحة',
      notFound: 'غير موجودة',
      certificateId: 'معرف الشهادة',
      verifiedBy: 'تم التحقق بواسطة',
      result: 'النتيجة',
      verifiedAt: 'تاريخ التحقق',
      noData: 'لا توجد سجلات',
      loading: 'جاري التحميل...',
      total: 'إجمالي',
      guest: 'زائر',
    },
    en: {
      title: 'Verification History',
      search: 'Search...',
      all: 'All',
      valid: 'Valid',
      invalid: 'Invalid',
      notFound: 'Not Found',
      certificateId: 'Certificate ID',
      verifiedBy: 'Verified By',
      result: 'Result',
      verifiedAt: 'Verified At',
      noData: 'No records found',
      loading: 'Loading...',
      total: 'Total',
      guest: 'Guest',
    },
  };

  const t = translations[language as keyof typeof translations];

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'valid':
        return <CheckCircle size={18} />;
      case 'invalid':
        return <XCircle size={18} />;
      case 'not_found':
        return <AlertCircle size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="verification-history-page">
      <div className="page-header">
        <div className="header-content">
          <History size={32} />
          <div>
            <h1>{t.title}</h1>
            <p className="count-badge">
              {t.total}: {filteredHistory.length}
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterResult === 'all' ? 'active' : ''}`}
              onClick={() => setFilterResult('all')}
            >
              {t.all}
            </button>
            <button
              className={`filter-btn ${filterResult === 'valid' ? 'active' : ''}`}
              onClick={() => setFilterResult('valid')}
            >
              {t.valid}
            </button>
            <button
              className={`filter-btn ${filterResult === 'invalid' ? 'active' : ''}`}
              onClick={() => setFilterResult('invalid')}
            >
              {t.invalid}
            </button>
            <button
              className={`filter-btn ${filterResult === 'not_found' ? 'active' : ''}`}
              onClick={() => setFilterResult('not_found')}
            >
              {t.notFound}
            </button>
          </div>
        </div>
      </div>

      <div className="history-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>{t.certificateId}</th>
                  <th>{t.verifiedBy}</th>
                  <th>{t.result}</th>
                  <th>{t.verifiedAt}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <code className="cert-id">{record.certificate_id}</code>
                    </td>
                    <td>{record.verified_by || t.guest}</td>
                    <td>
                      <span className={`result-badge ${record.result}`}>
                        {getResultIcon(record.result)}
                        <span>
                          {record.result === 'valid'
                            ? t.valid
                            : record.result === 'invalid'
                            ? t.invalid
                            : t.notFound}
                        </span>
                      </span>
                    </td>
                    <td>
                      {new Date(record.verified_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <History size={64} />
            <p>{t.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
};
