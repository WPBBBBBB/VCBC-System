# CVBC System - Certificate Verification Blockchain

نظام متقدم للتحقق من الشهادات باستخدام تقنية البلوكشين والتخزين الموزع

## المميزات

- ✅ تحقق آمن من الشهادات
- ✅ لوحة تحكم للمشرفين
- ✅ إصدار شهادات جديدة
- ✅ سجل التحققات
- ✅ دعم اللغة العربية والإنجليزية
- ✅ الوضع الليلي والنهاري

## التقنيات المستخدمة

- React 18
- TypeScript
- Vite
- Supabase
- React Router
- Lucide Icons

## التثبيت المحلي

```bash
# تثبيت المكتبات
npm install

# إنشاء ملف .env.local
cp .env.example .env.local

# تعديل .env.local بمعلومات Supabase الخاصة بك

# تشغيل المشروع
npm run dev
```

## النشر على Render

1. ارفع المشروع إلى GitHub
2. اذهب إلى [Render.com](https://render.com)
3. اختر "New Static Site"
4. اربط مع GitHub repository
5. أضف Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. اضغط Deploy

## قاعدة البيانات

قم بتنفيذ `supabase-schema.sql` في Supabase SQL Editor

## المشرف الافتراضي

- Username: `admin`
- Password: `admin123`

⚠️ **مهم:** غيّر كلمة المرور بعد أول تسجيل دخول!

## الترخيص

جميع الحقوق محفوظة © 2025
