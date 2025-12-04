import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, type DashboardStats, type Certificate } from '../../services/supabase';
import {
  FileText,
  CheckCircle,
  Users,
  Activity,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { admin, getDashboardStats, logDashboardVisit } = useAdmin();
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    logDashboardVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load stats
      const statsData = await getDashboardStats();
      setStats(statsData);

      // Load recent certificates
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          managers!certificates_issued_by_fkey(name)
        `)
        .order('issued_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        const formattedData = data.map((cert: Certificate & { managers?: { name: string } }) => ({
          ...cert,
          issued_by_name: cert.managers?.name || 'Unknown',
        }));
        setRecentCertificates(formattedData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    ar: {
      welcome: 'مرحباً',
      overview: 'نظرة عامة',
      totalCertificates: 'إجمالي الشهادات',
      totalVerifications: 'إجمالي التحققات',
      totalManagers: 'إجمالي المشرفين',
      dashboardVisits: 'زيارات لوحة التحكم',
      recentCertificates: 'أحدث الشهادات المصدرة',
      studentName: 'اسم الطالب',
      studentId: 'رقم الطالب',
      department: 'القسم',
      issuedBy: 'صادرة من',
      issuedAt: 'تاريخ الإصدار',
      noData: 'لا توجد بيانات',
      loading: 'جاري التحميل...',
    },
    en: {
      welcome: 'Welcome',
      overview: 'Overview',
      totalCertificates: 'Total Certificates',
      totalVerifications: 'Total Verifications',
      totalManagers: 'Total Managers',
      dashboardVisits: 'Dashboard Visits',
      recentCertificates: 'Recently Issued Certificates',
      studentName: 'Student Name',
      studentId: 'Student ID',
      department: 'Department',
      issuedBy: 'Issued By',
      issuedAt: 'Issue Date',
      noData: 'No data available',
      loading: 'Loading...',
    },
  };

  const t = translations[language as keyof typeof translations];

  const statsCards = [
    {
      icon: FileText,
      label: t.totalCertificates,
      value: stats?.total_certificates || 0,
      color: '#6b72ff',
      bgColor: 'rgba(107, 114, 255, 0.1)',
    },
    {
      icon: CheckCircle,
      label: t.totalVerifications,
      value: stats?.total_verifications || 0,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      icon: Users,
      label: t.totalManagers,
      value: stats?.total_managers || 0,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: Activity,
      label: t.dashboardVisits,
      value: stats?.total_dashboard_visits || 0,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1>
            {t.welcome}, {admin?.name}! 👋
          </h1>
          <p className="dashboard-subtitle">{t.overview}</p>
        </div>
        <div className="dashboard-date">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: stat.bgColor }}>
                <Icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h2 className="stat-value">{stat.value.toLocaleString()}</h2>
                <div className="stat-trend">
                  <TrendingUp size={14} />
                  <span>+12%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Certificates */}
      <div className="recent-section">
        <div className="section-header">
          <h2>{t.recentCertificates}</h2>
        </div>
        <div className="certificates-table">
          {recentCertificates.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>{t.studentName}</th>
                  <th>{t.studentId}</th>
                  <th>{t.department}</th>
                  <th>{t.issuedBy}</th>
                  <th>{t.issuedAt}</th>
                </tr>
              </thead>
              <tbody>
                {recentCertificates.map((cert) => (
                  <tr key={cert.id}>
                    <td className="student-name">{cert.student_name}</td>
                    <td className="student-id">{cert.student_id}</td>
                    <td>{cert.department}</td>
                    <td>{cert.issued_by_name}</td>
                    <td>
                      {new Date(cert.issued_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <FileText size={48} />
              <p>{t.noData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
