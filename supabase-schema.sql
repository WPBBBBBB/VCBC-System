-- ============================================
-- Supabase Schema for Certificate System
-- ============================================

-- 1. جدول المدراء (Managers)
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  admin_username VARCHAR(100) UNIQUE NOT NULL,
  admin_password VARCHAR(255) NOT NULL, -- يفضل استخدام hash
  role VARCHAR(50) DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. تحديث جدول الشهادات (Certificates)
DROP TABLE IF EXISTS certificates CASCADE;
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(255) NOT NULL,
  graduation_year INTEGER NOT NULL,
  pdf_url TEXT,
  hash VARCHAR(255) UNIQUE NOT NULL,
  issued_by UUID REFERENCES managers(id) ON DELETE SET NULL,
  issued_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. جدول زيارات Dashboard
CREATE TABLE IF NOT EXISTS dashboard_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID REFERENCES managers(id) ON DELETE CASCADE,
  visited_at TIMESTAMP DEFAULT NOW()
);

-- 4. تحديث جدول سجل التحقق
DROP TABLE IF EXISTS verification_history CASCADE;
CREATE TABLE verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID REFERENCES certificates(id) ON DELETE CASCADE,
  verified_by VARCHAR(255), -- يمكن أن يكون user عادي أو guest
  result VARCHAR(50) NOT NULL CHECK (result IN ('valid', 'invalid', 'not_found')),
  verified_at TIMESTAMP DEFAULT NOW()
);

-- 5. إنشاء فهارس للأداء
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_hash ON certificates(hash);
CREATE INDEX idx_certificates_issued_by ON certificates(issued_by);
CREATE INDEX idx_verification_certificate_id ON verification_history(certificate_id);
CREATE INDEX idx_verification_verified_at ON verification_history(verified_at);
CREATE INDEX idx_managers_username ON managers(admin_username);
CREATE INDEX idx_managers_email ON managers(email);

-- 6. إضافة مشرف افتراضي (للاختبار فقط - غيّر كلمة المرور!)
-- حذف المشرف القديم إذا كان موجوداً
DELETE FROM managers WHERE admin_username = 'admin';

-- إضافة مشرف تجريبي بكلمة مرور بسيطة للتطوير
INSERT INTO managers (name, email, admin_username, admin_password, role, avatar_url)
VALUES (
  'Admin User',
  'admin@example.com',
  'admin',
  'admin123', -- كلمة مرور بسيطة للتطوير فقط!
  'super_admin',
  NULL
);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_visits ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة للجميع (للشهادات)
CREATE POLICY "Anyone can read certificates"
  ON certificates FOR SELECT
  USING (true);

-- سياسات الكتابة للمدراء فقط
CREATE POLICY "Only managers can insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (issued_by IN (SELECT id FROM managers));

CREATE POLICY "Only managers can update certificates"
  ON certificates FOR UPDATE
  USING (issued_by IN (SELECT id FROM managers));

CREATE POLICY "Only managers can delete certificates"
  ON certificates FOR DELETE
  USING (issued_by IN (SELECT id FROM managers));

-- سياسات سجل التحقق
CREATE POLICY "Anyone can insert verification history"
  ON verification_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read verification history"
  ON verification_history FOR SELECT
  USING (true);

-- 8. Functions مساعدة

-- دالة لتوليد Hash للشهادة
CREATE OR REPLACE FUNCTION generate_certificate_hash(
  p_student_id VARCHAR,
  p_student_name VARCHAR,
  p_department VARCHAR
)
RETURNS VARCHAR AS $$
DECLARE
  v_hash VARCHAR;
BEGIN
  v_hash := UPPER(SUBSTRING(MD5(p_student_id || p_student_name || p_department || NOW()::TEXT) FROM 1 FOR 16));
  RETURN 'CERT-' || v_hash;
END;
$$ LANGUAGE plpgsql;

-- دالة لتسجيل زيارة Dashboard
CREATE OR REPLACE FUNCTION log_dashboard_visit(p_manager_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO dashboard_visits (manager_id, visited_at)
  VALUES (p_manager_id, NOW());
END;
$$ LANGUAGE plpgsql;

-- 9. Triggers

-- Trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_managers_updated_at
  BEFORE UPDATE ON managers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Views مفيدة

-- View لإحصائيات Dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM certificates) AS total_certificates,
  (SELECT COUNT(*) FROM verification_history) AS total_verifications,
  (SELECT COUNT(*) FROM dashboard_visits) AS total_dashboard_visits,
  (SELECT COUNT(*) FROM managers) AS total_managers;

-- View لآخر الشهادات الصادرة
CREATE OR REPLACE VIEW recent_certificates AS
SELECT
  c.*,
  m.name AS issued_by_name
FROM certificates c
LEFT JOIN managers m ON c.issued_by = m.id
ORDER BY c.issued_at DESC
LIMIT 10;

-- ============================================
-- ملاحظات مهمة:
-- ============================================
-- 1. غيّر كلمة المرور الافتراضية للمشرف
-- 2. استخدم bcrypt لتشفير كلمات المرور
-- 3. في الإنتاج، استخدم JWT tokens للمصادقة
-- 4. قم بتفعيل RLS بشكل صحيح حسب احتياجاتك
-- ============================================
