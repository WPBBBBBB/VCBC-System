# 🚀 الخطوات التالية - Setup Supabase

## ⚡ ملخص سريع

نظام المصادقة جاهز! الآن تحتاج فقط إلى إعداد Supabase و OAuth.

---

## 1️⃣ إنشاء مشروع Supabase

### الخطوة 1: التسجيل
1. اذهب إلى [supabase.com](https://supabase.com)
2. انقر على "Start Your Project"
3. سجل دخول باستخدام GitHub أو Google

### الخطوة 2: إنشاء مشروع جديد
1. انقر على "Create a new project"
2. اختر أي منطقة
3. عيّن كلمة مرور آمنة
4. انقر "Create new project"
5. انتظر التهيئة (2-3 دقائق)

### الخطوة 3: الحصول على المفاتيح
1. اذهب إلى **Settings** → **API**
2. انسخ **URL** و **anon key**
3. احفظهما في مكان آمن

---

## 2️⃣ تحديث .env.local

أفتح الملف `.env.local` في المشروع:

```env
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_ANON_KEY=your-very-long-key-here
```

استبدل القيم بالمفاتيح الفعلية من Supabase.

---

## 3️⃣ إعداد قاعدة البيانات

### 1. إنشاء الجداول

اذهب إلى **SQL Editor** في Supabase وشغّل هذا السكريبت:

```sql
-- جدول معلومات المستخدم
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50),
  last_login TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email)
);

-- جدول سجل التحقق
CREATE TABLE verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  certificate_id VARCHAR(255) NOT NULL,
  verification_result VARCHAR(50) NOT NULL,
  certificate_name VARCHAR(255),
  verified_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- فهارس للأداء
CREATE INDEX idx_verification_user_id ON verification_history(user_id);
CREATE INDEX idx_verification_result ON verification_history(verification_result);
CREATE INDEX idx_verification_certificate ON verification_history(certificate_id);
```

### 2. إعداد RLS (Row Level Security)

لكل جدول:
1. اذهب إلى **Authentication** → **Policies**
2. اختر الجدول
3. أضف السياسات الضرورية (اختياري للتطوير)

---

## 4️⃣ إعداد OAuth Providers

### Google OAuth

#### في Google Cloud Console:
1. اذهب إلى [console.cloud.google.com](https://console.cloud.google.com)
2. أنشئ مشروع جديد
3. اذهب إلى **APIs & Services** → **Credentials**
4. اختر **Create Credentials** → **OAuth 2.0 Client ID**
5. اختر **Web application**
6. في "Authorized JavaScript origins" أضف:
   - `http://localhost:5173`
   - `http://localhost:3000`
7. في "Authorized redirect URIs" أضف:
   - `http://localhost:5173/dashboard`
   - `https://your-domain/dashboard`
8. انسخ **Client ID** و **Client Secret**

#### في Supabase:
1. اذهب إلى **Authentication** → **Providers**
2. اختر **Google**
3. الصق **Client ID** و **Client Secret**
4. انقر **Save**

### GitHub OAuth

#### في GitHub Settings:
1. اذهب إلى **Developer settings** → **OAuth Apps**
2. انقر **New OAuth App**
3. ملأ البيانات:
   - **Application name**: اسم تطبيقك
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/dashboard`
4. انسخ **Client ID** و **Client Secret**

#### في Supabase:
1. اذهب إلى **Authentication** → **Providers**
2. اختر **GitHub**
3. الصق **Client ID** و **Client Secret**
4. انقر **Save**

### Microsoft OAuth

#### في Azure Portal:
1. اذهب إلى [portal.azure.com](https://portal.azure.com)
2. اذهب إلى **Azure Active Directory** → **App registrations**
3. انقر **New registration**
4. في **Redirect URIs** اختر **Web**
5. أضف: `http://localhost:5173/dashboard`
6. انسخ **Application (client) ID**
7. اذهب إلى **Certificates & secrets**
8. أنشئ secret جديد وانسخه

#### في Supabase:
1. اذهب إلى **Authentication** → **Providers**
2. اختر **Azure**
3. الصق **Application ID** و **Secret**
4. انقر **Save**

---

## 5️⃣ اختبار المشروع

```bash
# تأكد من أن .env.local محدّث
# اذهب إلى المشروع
cd "c:\Users\mahdi\OneDrive\سطح المكتب\مشاريع\مشروع كرار"

# شغّل الخادم
npm run dev

# افتح المتصفح
# http://localhost:5173
```

### اختبار تسجيل الدخول

1. انقر على زر الملف الشخصي (أعلى اليمين)
2. اختر `/login`
3. انقر على أحد أزرار OAuth
4. سجل دخول باستخدام حسابك
5. يجب أن يعيد توجيهك إلى `/dashboard`

---

## 🎯 Checklist

- [ ] إنشاء مشروع Supabase
- [ ] الحصول على URL و anon key
- [ ] تحديث .env.local
- [ ] إنشاء الجداول
- [ ] إعداد Google OAuth
- [ ] إعداد GitHub OAuth
- [ ] إعداد Microsoft OAuth
- [ ] اختبار تسجيل الدخول
- [ ] اختبار Dashboard
- [ ] اختبار سجل التحققات

---

## 🆘 مشاكل شائعة

### "Cannot read property 'supabase' of undefined"
**الحل:** تأكد من تحديث .env.local بالمفاتيح الصحيحة

### OAuth لا يعمل
**الحل:** تأكد من إضافة Redirect URLs الصحيحة

### "user is null" في Dashboard
**الحل:** هل سجلت دخول بنجاح؟ تحقق من localStorage

### جداول لا توجد
**الحل:** تأكد من تشغيل SQL script في Supabase

---

## 📞 المساعدة

- اقرأ `AUTHENTICATION_GUIDE.md` للمزيد من التفاصيل
- اطّلع على [Supabase Docs](https://supabase.com/docs)
- تحقق من التعليقات في الكود

---

## ✅ تم الإعداد!

بعد إكمال هذه الخطوات، يجب أن يعمل نظام المصادقة بالكامل! 🎉

**استمتع بتطويرك!** 🚀
