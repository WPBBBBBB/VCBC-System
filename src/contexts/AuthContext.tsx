import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { UserProfile, VerificationRecord } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  verificationHistory: VerificationRecord[];
  addVerificationRecord: (record: Omit<VerificationRecord, 'id' | 'verified_at' | 'user_id'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([]);

  // استرجاع بيانات المستخدم الأساسية
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('خطأ في جلب ملف المستخدم:', fetchError);
        return null;
      }

      if (data) {
        setProfile(data as UserProfile);
        return data;
      }

      return null;
    } catch (err) {
      console.error('خطأ:', err);
      return null;
    }
  };

  // استرجاع سجل التحققات
  const fetchVerificationHistory = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('verification_history')
        .select('*')
        .eq('user_id', userId)
        .order('verified_at', { ascending: false });

      if (fetchError) {
        console.error('خطأ في جلب السجل:', fetchError);
        return;
      }

      setVerificationHistory((data as VerificationRecord[]) || []);
    } catch (err) {
      console.error('خطأ:', err);
    }
  };

  // تحديث بيانات المستخدم
  const refreshProfile = async () => {
    if (!user) return;
    await fetchUserProfile(user.id);
    await fetchVerificationHistory(user.id);
  };

  // إنشاء أو تحديث ملف المستخدم بعد تسجيل الدخول
  const createOrUpdateProfile = async (
    authUser: User,
    provider: 'google' | 'github' | 'microsoft'
  ) => {
    try {
      const userData: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'مستخدم',
        avatar_url: authUser.user_metadata?.avatar_url || '',
        provider,
        last_login: new Date().toISOString(),
        created_at: authUser.created_at || new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert([userData], { onConflict: 'id' });

      if (upsertError) {
        console.error('خطأ في حفظ الملف:', upsertError);
        return;
      }

      setProfile(userData);
    } catch (err) {
      console.error('خطأ:', err);
    }
  };

  // تسجيل الدخول عبر Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (signInError) throw signInError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في تسجيل الدخول';
      setError(message);
      console.error('خطأ في Google OAuth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول عبر GitHub
  const signInWithGitHub = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (signInError) throw signInError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في تسجيل الدخول';
      setError(message);
      console.error('خطأ في GitHub OAuth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول عبر Microsoft
  const signInWithMicrosoft = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (signInError) throw signInError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في تسجيل الدخول';
      setError(message);
      console.error('خطأ في Microsoft OAuth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      setProfile(null);
      setVerificationHistory([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في تسجيل الخروج';
      setError(message);
      console.error('خطأ:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة سجل تحقق جديد
  const addVerificationRecord = async (
    record: Omit<VerificationRecord, 'id' | 'verified_at' | 'user_id'>
  ) => {
    if (!user) throw new Error('المستخدم غير مسجل دخول');

    try {
      const newRecord: VerificationRecord = {
        ...record,
        id: crypto.randomUUID(),
        user_id: user.id,
        verified_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('verification_history')
        .insert([newRecord]);

      if (insertError) throw insertError;

      setVerificationHistory([newRecord, ...verificationHistory]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ في إضافة السجل';
      setError(message);
      console.error('خطأ:', err);
      throw err;
    }
  };

  // مراقبة حالة المصادقة
  useEffect(() => {
    setIsLoading(true);

    // الحصول على المستخدم الحالي
    const getCurrentUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (currentUser) {
          setUser(currentUser);
          await fetchUserProfile(currentUser.id);
          await fetchVerificationHistory(currentUser.id);
        } else {
          setUser(null);
          setProfile(null);
          setVerificationHistory([]);
        }
      } catch (err) {
        console.error('خطأ في الحصول على المستخدم:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();

    // الاستماع لتغييرات المصادقة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);

        // إذا كان تسجيل دخول جديد، إنشاء الملف
        if (event === 'SIGNED_IN') {
          const provider = session.user.app_metadata?.provider as
            | 'google'
            | 'github'
            | 'azure'
            | undefined;
          if (provider) {
            const normalizedProvider = provider === 'azure' ? 'microsoft' : provider;
            await createOrUpdateProfile(session.user, normalizedProvider);
          }
          await fetchVerificationHistory(session.user.id);
        }
      } else {
        setUser(null);
        setProfile(null);
        setVerificationHistory([]);
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        error,
        signInWithGoogle,
        signInWithGitHub,
        signInWithMicrosoft,
        signOut,
        refreshProfile,
        verificationHistory,
        addVerificationRecord,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook للوصول إلى Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth يجب أن يستخدم داخل AuthProvider');
  }
  return context;
};
