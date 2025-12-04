-- ========================================
-- إصلاح مشكلة RLS لجدول managers
-- ========================================

-- الخيار 1: تعطيل RLS مؤقتاً (للتطوير فقط)
ALTER TABLE managers DISABLE ROW LEVEL SECURITY;

-- الخيار 2: إضافة سياسة للسماح بالإضافة (إذا أردت إبقاء RLS مفعل)
-- DROP POLICY IF EXISTS "Allow insert managers" ON managers;
-- CREATE POLICY "Allow insert managers"
--   ON managers FOR INSERT
--   WITH CHECK (true);

-- إضافة المدير الأساسي
INSERT INTO managers (name, email, admin_username, admin_password, role)
VALUES ('Admin User', 'admin@example.com', 'admin', 'admin123', 'super_admin')
ON CONFLICT (admin_username) DO NOTHING;

-- التحقق من النتيجة
SELECT id, name, admin_username, role, created_at 
FROM managers 
WHERE admin_username = 'admin';
