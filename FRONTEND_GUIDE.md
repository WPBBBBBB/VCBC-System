# دليل الواجهة الأمامية | Frontend Guide

## 📋 الملخص | Overview

تم بناء واجهة موقع كاملة واحترافية لنظام التحقق من الشهادات القائم على البلوكشين باستخدام:
- **React 18** - مكتبة الواجهات الأمامية
- **TypeScript** - للأمان النوعي
- **React Router v6** - لإدارة التوجيه
- **Vite** - لبناء وتطوير سريع
- **CSS مخصص** - تصميم أصيل بدون قوالب جاهزة
- **Lucide React** - أيقونات عصرية
- **QRCode React** - لتوليد رموز QR

## 🏗️ البنية المعمارية | Architecture

### Layer Pattern

```
┌─────────────────────────────────────┐
│         React Router (SPA)          │
├─────────────────────────────────────┤
│         Pages Layer                 │
│ (HomePage, IssueCertificate, etc.)  │
├─────────────────────────────────────┤
│         Components Layer             │
│ (Header, Footer, PageTransition)    │
├─────────────────────────────────────┤
│         Contexts Layer              │
│ (ThemeContext, LanguageContext)     │
├─────────────────────────────────────┤
│         Services Layer              │
│ (CertificateService)                │
├─────────────────────────────────────┤
│         Styles Layer                │
│ (global.css, component-specific)    │
└─────────────────────────────────────┘
```

## 🎨 نظام الألوان والتصميم | Design System

### نظام الأطوال والمسافات | Spacing Scale

```css
xs = 0.5rem (8px)
sm = 0.75rem (12px)
md = 1rem (16px)
lg = 1.5rem (24px)
xl = 2rem (32px)
2xl = 3rem (48px)
3xl = 4rem (64px)
```

### نصف القطر | Border Radius

```css
sm = 0.375rem (6px)      - للأزرار الصغيرة
md = 0.5rem (8px)        - للمدخلات
lg = 0.75rem (12px)      - للبطاقات الصغيرة
xl = 1rem (16px)         - للبطاقات الرئيسية
2xl = 1.5rem (24px)      - للقسام الكبيرة
```

### الظلال | Shadows

```css
sm = 0 1px 2px rgba(0, 0, 0, 0.05)
md = 0 4px 6px rgba(0, 0, 0, 0.1)
lg = 0 10px 15px rgba(0, 0, 0, 0.15)
xl = 0 20px 25px rgba(0, 0, 0, 0.2)
```

## 🔄 نظام الحالات | State Management

### Theme Context

```typescript
// استخدام الوضع الليلي
const { theme, toggleTheme } = useTheme();

// يتم حفظ الاختيار في localStorage
// يتم تحديث class على عنصر <html>
```

### Language Context

```typescript
// استخدام اللغة
const { language, toggleLanguage, t } = useLanguage();

// language = 'ar' | 'en'
// t() = دالة الترجمة
// يتم حفظ اللغة في localStorage
// يتم تحديث dir على عنصر <html>
```

## 📱 الاستجابة | Responsive Design

### نقاط التوقف | Breakpoints

```css
Desktop:  > 1024px
Tablet:   768px - 1024px
Mobile:   < 768px
Small:    < 480px
```

### استراتيجية الاستجابة

- **Mobile-First**: البدء بتصميم الموبايل ثم التوسع
- **Flex & Grid**: استخدام flexbox و CSS Grid
- **Fluid Typography**: نصوص تتكيف مع الحجم
- **Touch-Friendly**: أزرار وعناصر كبيرة في الموبايل

## 🎭 الانتقالات والحركات | Animations

### Page Transitions

```typescript
// عند دخول الصفحة
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

// مدة الانتقال = 400ms ease-out
```

### Hover Effects

```css
- أزرار تتحرك للأعلى قليلاً
- الألوان تتغير بسلاسة
- الظلال تتزايد
- مؤشرات بصرية واضحة
```

### Loading Animation

```css
- دوران (spinner)
- نبضات (pulse)
- تأثيرات الرفع والانخفاض
```

## 🌍 الدعم الثنائي اللغة | Bilingual Support

### كيفية الترجمة

```typescript
// في LanguageContext.tsx
const translations = {
  ar: { key: 'نص عربي' },
  en: { key: 'English text' }
};

// الاستخدام
const { t } = useLanguage();
const text = t('key'); // يرجع النص المناسب
```

### التحويل الفوري

```typescript
// عند تبديل اللغة
1. تحديث state في Context
2. حفظ اللغة في localStorage
3. تحديث dir على <html>
4. تحديث lang على <html>
5. إعادة تصيير جميع المكونات
```

### اتجاه النص (RTL/LTR)

```css
html[dir="rtl"] { direction: rtl; }
html[dir="ltr"] { direction: ltr; }

/* العناصر تتكيف تلقائياً */
flex-direction: row-reverse; /* في RTL */
margin-right: auto; /* يصبح margin-left في RTL */
```

## 📊 خدمة الشهادات | Certificate Service

### CertificateService API

```typescript
// إصدار شهادة جديدة
const cert = CertificateService.issueCertificate({
  studentName: string,
  studentID: string,
  specialization: string,
  graduationYear: number,
});

// التحقق من شهادة
const cert = CertificateService.verifyCertificate(certificateID: string);

// الحصول على جميع الشهادات
const certs = CertificateService.getAllCertificates();
```

### بنية الشهادة

```typescript
interface Certificate {
  id: string;                    // معرّف الشهادة الفريد
  studentName: string;           // اسم الطالب
  studentID: string;             // رقم الطالب
  specialization: string;        // التخصص
  graduationYear: number;        // سنة التخرج
  issueDate: string;             // تاريخ الإصدار (YYYY-MM-DD)
  ipfsCID: string;               // معرّف IPFS
  blockchainHash: string;        // بصمة البلوكشين
  isValid: boolean;              // حالة الصحة
}
```

## 🔐 التخزين المحلي | Local Storage

### ما يتم حفظه

```typescript
localStorage.getItem('theme')    // 'light' | 'dark'
localStorage.getItem('language') // 'ar' | 'en'
```

### كيفية الاستخدام

```typescript
// تلقائي عند تحميل التطبيق
useEffect(() => {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
}, []);

// تلقائي عند التغيير
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

## 🧪 البيانات التجريبية | Mock Data

### شهادات للاختبار

```
1. CERT-2024-001 ✓ (صحيحة)
   - الاسم: أحمد محمد علي
   - التخصص: علوم الحاسب الآلي
   - السنة: 2024

2. CERT-2024-002 ✓ (صحيحة)
   - الاسم: فاطمة أحمد سالم
   - التخصص: الهندسة الكهربائية
   - السنة: 2024

3. CERT-2023-FAKE ✗ (مزورة)
   - للاختبار فقط
```

## 🚀 خطوات الإنشاء والتطوير | Development Steps

### 1. القراءة والفهم

- اقرأ `README.md` للمعلومات العامة
- افهم البنية المعمارية
- تعرف على نظام التصميم

### 2. التطوير المحلي

```bash
npm install              # تثبيت المكتبات
npm run dev             # خادم التطوير
npm run build           # بناء الإنتاج
npm run lint            # فحص الأخطاء
```

### 3. إضافة مميزات جديدة

```bash
# إضافة صفحة جديدة
1. أنشئ مجلد في src/pages/
2. أنشئ ملف .tsx و .css
3. أضف الـ Route في App.tsx
4. أضف الترجمات في LanguageContext

# إضافة مكون جديد
1. أنشئ مجلد في src/components/
2. أنشئ ملف .tsx و .css
3. استورده واستخدمه حيث تحتاج
```

## 🔗 التكامل مع البلوكشين | Blockchain Integration

### خطوات التكامل

```typescript
// 1. تثبيت ethers.js
npm install ethers

// 2. إنشاء ملف جديد (Web3Service.ts)
import { ethers } from 'ethers';

// 3. الاتصال بالشبكة
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = provider.getSigner();

// 4. التفاعل مع العقد الذكي
const contract = new ethers.Contract(ADDRESS, ABI, signer);

// 5. استدعاء الدوال
const tx = await contract.issueCertificate(data);
```

## 📚 المراجع | References

- [React Documentation](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 🎯 قائمة الاختيار | Checklist

- [x] تصميم احترافي وحديث
- [x] دعم اللغة العربية والإنجليزية
- [x] وضع ليلي ونهاري
- [x] جميع الصفحات الأربع
- [x] نظام التوجيه (Routing)
- [x] انتقالات سلسة
- [x] استجابة كاملة
- [x] نظام الألوان والتصميم
- [x] بيانات تجريبية
- [x] أيقونات وتأثيرات بصرية
- [ ] تكامل مع عقد ذكي (Ready)
- [ ] تكامل IPFS الفعلي
- [ ] لوحة تحكم للمسؤولين

---

**تم بناء هذا الدليل لمساعدتك على فهم واستخدام الواجهة الأمامية**
