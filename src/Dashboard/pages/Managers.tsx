import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, type Manager } from '../../services/supabase';
import { Users, Search, UserPlus, Edit2, Trash2, Shield } from 'lucide-react';
import './Managers.css';

export const Managers: React.FC = () => {
  const { language } = useLanguage();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setManagers(data);
      }
    } catch (error) {
      console.error('Error loading managers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'ar' ? 'هل تريد حذف هذا المشرف؟' : 'Delete this manager?')) {
      return;
    }

    try {
      const { error } = await supabase.from('managers').delete().eq('id', id);
      if (!error) {
        loadManagers();
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const filteredManagers = managers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.admin_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const translations = {
    ar: {
      title: 'إدارة المشرفين',
      addNew: 'إضافة مشرف جديد',
      search: 'بحث...',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      username: 'اسم المستخدم',
      role: 'الدور',
      createdAt: 'تاريخ الإنشاء',
      actions: 'الإجراءات',
      noData: 'لا يوجد مشرفين',
      loading: 'جاري التحميل...',
      total: 'إجمالي',
      admin: 'مشرف',
      superAdmin: 'مشرف أعلى',
    },
    en: {
      title: 'Manage Administrators',
      addNew: 'Add New Admin',
      search: 'Search...',
      name: 'Name',
      email: 'Email',
      username: 'Username',
      role: 'Role',
      createdAt: 'Created At',
      actions: 'Actions',
      noData: 'No administrators found',
      loading: 'Loading...',
      total: 'Total',
      admin: 'Admin',
      superAdmin: 'Super Admin',
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="managers-page">
      <div className="page-header">
        <div className="header-content">
          <Users size={32} />
          <div>
            <h1>{t.title}</h1>
            <p className="count-badge">
              {t.total}: {filteredManagers.length}
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
          <button className="btn-add">
            <UserPlus size={18} />
            <span>{t.addNew}</span>
          </button>
        </div>
      </div>

      <div className="managers-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : filteredManagers.length > 0 ? (
          <div className="table-wrapper">
            <table className="managers-table">
              <thead>
                <tr>
                  <th>{t.name}</th>
                  <th>{t.email}</th>
                  <th>{t.username}</th>
                  <th>{t.role}</th>
                  <th>{t.createdAt}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.map((manager) => (
                  <tr key={manager.id}>
                    <td>
                      <div className="manager-name">
                        <div className="manager-avatar">
                          {manager.avatar_url ? (
                            <img src={manager.avatar_url} alt={manager.name} />
                          ) : (
                            <Shield size={18} />
                          )}
                        </div>
                        <span>{manager.name}</span>
                      </div>
                    </td>
                    <td className="email">{manager.email}</td>
                    <td className="username">{manager.admin_username}</td>
                    <td>
                      <span className={`role-badge ${manager.role}`}>
                        {manager.role === 'super_admin' ? t.superAdmin : t.admin}
                      </span>
                    </td>
                    <td>{new Date(manager.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit-btn" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(manager.id)}
                          title="Delete"
                        >
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
            <Users size={64} />
            <p>{t.noData}</p>
          </div>
        )}
      </div>
    </div>
  );
};
