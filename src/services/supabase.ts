import { createClient } from '@supabase/supabase-js';

// استبدل هذه المتغيرات ببيانات مشروعك من Supabase
// للعثور عليها: https://app.supabase.com → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// نوع المستخدم العادي (OAuth)
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  provider: 'google' | 'github' | 'microsoft';
  last_login: string;
  created_at: string;
}

// نوع المدير (Admin)
export interface Manager {
  id: string;
  name: string;
  email: string;
  admin_username: string;
  admin_password?: string; // لا نعيدها عادة من السيرفر
  role: 'admin' | 'super_admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// نوع الشهادة
export interface Certificate {
  id: string;
  student_name: string;
  student_id: string;
  department: string;
  graduation_year: number;
  pdf_url?: string;
  hash: string;
  issued_by?: string; // Manager ID
  issued_at: string;
  created_at: string;
  updated_at: string;
  // علاقات
  issued_by_name?: string; // من join مع جدول managers
}

// نوع زيارة Dashboard
export interface DashboardVisit {
  id: string;
  manager_id: string;
  visited_at: string;
}

// نوع سجل التحقق (محدّث)
export interface VerificationRecord {
  id: string;
  certificate_id: string;
  verified_by?: string; // يمكن أن يكون user أو guest
  result: 'valid' | 'invalid' | 'not_found';
  verified_at: string;
  // للتوافق مع الكود القديم
  user_id?: string;
  verification_result?: 'valid' | 'invalid' | 'not_found';
  certificate_name?: string;
}

// نوع إحصائيات Dashboard
export interface DashboardStats {
  total_certificates: number;
  total_verifications: number;
  total_dashboard_visits: number;
  total_managers: number;
}

// نوع بيانات إدخال شهادة جديدة
export interface CertificateInput {
  student_name: string;
  student_id: string;
  department: string;
  graduation_year: number;
  pdf_url?: string;
  issued_by: string; // Manager ID
}
