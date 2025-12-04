import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, type Manager, type DashboardStats } from '../services/supabase';

// نوع بيانات تسجيل دخول Admin
interface AdminLoginCredentials {
  username: string;
  password: string;
}

// نوع Context
interface AdminContextType {
  admin: Manager | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AdminLoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getDashboardStats: () => Promise<DashboardStats | null>;
  logDashboardVisit: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hook لاستخدام Admin Context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

// Provider Component
export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Manager | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تحقق من الجلسة المحفوظة عند تحميل التطبيق
  useEffect(() => {
    checkSession();
  }, []);

  // فحص الجلسة من localStorage
  const checkSession = () => {
    try {
      const savedAdmin = localStorage.getItem('admin_session');
      if (savedAdmin) {
        const adminData = JSON.parse(savedAdmin) as Manager;
        setAdmin(adminData);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      localStorage.removeItem('admin_session');
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول
  const login = async (credentials: AdminLoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    console.log('🔐 محاولة تسجيل الدخول:', { username: credentials.username });
    
    try {
      // ملاحظة: هذا نهج مبسّط. في الإنتاج، يجب استخدام Supabase Auth أو JWT
      // نتحقق من المدير في قاعدة البيانات
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .eq('admin_username', credentials.username)
        .single();

      console.log('📊 نتيجة الاستعلام:', { data, error });

      if (error) {
        console.error('❌ خطأ في Supabase:', error);
        return { 
          success: false, 
          error: 'خطأ في الاتصال بقاعدة البيانات: ' + error.message 
        };
      }

      if (!data) {
        console.warn('⚠️ المستخدم غير موجود');
        return { 
          success: false, 
          error: 'اسم المستخدم غير موجود' 
        };
      }

      // التحقق من كلمة المرور
      console.log('🔑 التحقق من كلمة المرور...');
      const passwordMatch = data.admin_password === credentials.password;
      
      console.log('✓ مطابقة كلمة المرور:', passwordMatch);
      
      if (!passwordMatch) {
        console.warn('⚠️ كلمة المرور غير صحيحة');
        return { 
          success: false, 
          error: 'كلمة المرور غير صحيحة' 
        };
      }
      
      // حذف كلمة المرور من البيانات المحفوظة
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { admin_password, ...adminData } = data;

      // حفظ الجلسة
      localStorage.setItem('admin_session', JSON.stringify(adminData));
      setAdmin(adminData);

      // تسجيل زيارة Dashboard
      await logDashboardVisit();

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'حدث خطأ أثناء تسجيل الدخول' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('admin_session');
    setAdmin(null);
    // إعادة توجيه لصفحة تسجيل الدخول
    window.location.href = '/login';
  };

  // جلب إحصائيات Dashboard
  const getDashboardStats = async (): Promise<DashboardStats | null> => {
    try {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data as DashboardStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  };

  // تسجيل زيارة Dashboard
  const logDashboardVisit = async (): Promise<void> => {
    if (!admin) return;
    
    try {
      await supabase
        .from('dashboard_visits')
        .insert({ manager_id: admin.id });
    } catch (error) {
      console.error('Error logging dashboard visit:', error);
    }
  };

  const value: AdminContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    getDashboardStats,
    logDashboardVisit,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
