# 🔐 تسجيل الدخول السريع - Admin

## ⚠️ خطوة مهمة قبل تسجيل الدخول!

يجب تحديث جدول المشرفين في Supabase:

### 1. افتح Supabase Dashboard
https://app.supabase.com/project/zucxosbiegdfllyzkufo

### 2. اذهب إلى SQL Editor

### 3. نفذ هذا الأمر:

```sql
-- حذف المشرف القديم
DELETE FROM managers WHERE admin_username = 'admin';

-- إضافة مشرف جديد بكلمة مرور بسيطة
INSERT INTO managers (name, email, admin_username, admin_password, role)
VALUES (
  'Admin User',
  'admin@example.com',
  'admin',
  'admin123',
  'super_admin'
);
```

### 4. تحقق من النجاح:

```sql
SELECT * FROM managers WHERE admin_username = 'admin';
```

يجب أن ترى:
- **name**: Admin User
- **admin_username**: admin
- **admin_password**: admin123
- **role**: super_admin

---

## 🚀 الآن يمكنك تسجيل الدخول!

1. افتح: http://localhost:5173/login
2. اضغط على زر **"مشرف"** في الأعلى
3. أدخل:
   - **Username**: `admin`
   - **Password**: `admin123`
4. اضغط **"دخول المشرف"**

✅ سيتم توجيهك إلى Dashboard!

---

## 🔒 ملاحظات الأمان

### ⚠️ للتطوير فقط:
- كلمة المرور الحالية (`admin123`) **غير مشفرة**
- هذا **آمن للتطوير** فقط!

### 🔐 للإنتاج:
استخدم **bcrypt** لتشفير كلمات المرور:

```bash
npm install bcryptjs
```

```javascript
import bcrypt from 'bcryptjs';

// تشفير كلمة المرور
const hashedPassword = await bcrypt.hash('your-password', 10);

// في SQL
INSERT INTO managers (admin_password, ...)
VALUES ('$2a$10$...hashed...', ...);
```

---

## 🐛 استكشاف الأخطاء

### "اسم المستخدم أو كلمة المرور غير صحيحة"

1. **تحقق من Supabase**:
```sql
SELECT admin_username, admin_password FROM managers;
```

2. **تأكد من البيانات**:
   - Username: `admin` (بدون مسافات)
   - Password: `admin123` (بدون مسافات)

3. **افحص Console**:
   - افتح Developer Tools (F12)
   - اذهب إلى Console
   - ابحث عن أخطاء

### Source Map Warning

خطأ `Source map error` في Console **طبيعي** ولا يؤثر على التطبيق.  
يمكنك تجاهله أو إخفاؤه من Console settings.

---

## ✅ Checklist

- [ ] نفذت SQL في Supabase
- [ ] تحققت من وجود المشرف
- [ ] استخدمت Username: `admin`
- [ ] استخدمت Password: `admin123`
- [ ] التطبيق يعمل على http://localhost:5173

---

## 📞 إذا استمرت المشكلة

افتح Developer Console (F12) وشارك:
1. الأخطاء في Console
2. الأخطاء في Network tab
3. صورة شاشة من Login page

---

**معلومات تسجيل الدخول:**
- **URL**: http://localhost:5173/login
- **Username**: admin
- **Password**: admin123
- **Type**: مشرف (اضغط زر "مشرف" في الأعلى)
