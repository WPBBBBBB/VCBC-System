# تعليمات التطوير والإضافات | Development Guidelines

## 🎯 إضافة صفحة جديدة | Adding a New Page

### الخطوة 1: إنشاء الملفات

```bash
src/pages/
├── NewPage.tsx          # المكون الرئيسي
└── NewPage.css          # الأنماط
```

### الخطوة 2: كتابة المكون

```typescript
// src/pages/NewPage.tsx

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/PageTransition';
import './NewPage.css';

export const NewPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <PageTransition>
      <div className="new-page">
        <h1>{t('pageTitle')}</h1>
        {/* المحتوى */}
      </div>
    </PageTransition>
  );
};

export default NewPage;
```

### الخطوة 3: إضافة الترجمات

```typescript
// في src/contexts/LanguageContext.tsx

const translations = {
  ar: {
    // ...
    pageTitle: 'عنوان الصفحة',
  },
  en: {
    // ...
    pageTitle: 'Page Title',
  },
};
```

### الخطوة 4: إضافة الـ Route

```typescript
// في src/App.tsx

import NewPage from './pages/NewPage';

// في داخل Routes:
<Route path="/new-page" element={<NewPage />} />
```

### الخطوة 5: إضافة الرابط في الـ Header

```typescript
// في src/components/Header.tsx

<Link to="/new-page" className={`nav-link ${isActive('/new-page') ? 'active' : ''}`}>
  {t('newPage')}
</Link>
```

## 🧩 إضافة مكون جديد | Adding a New Component

### البنية الموصى بها

```bash
src/components/
├── ComponentName.tsx     # المكون الرئيسي
└── ComponentName.css     # الأنماط
```

### مثال

```typescript
// src/components/MyComponent.tsx

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './MyComponent.css';

interface MyComponentProps {
  title?: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  const { language } = useLanguage();

  return (
    <div className="my-component">
      <h2>{title}</h2>
      {/* المحتوى */}
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

## 🎨 إضافة أنماط جديدة | Adding New Styles

### استخدام متغيرات CSS

```css
/* استخدم المتغيرات المعرفة في global.css */

.my-element {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.my-element:hover {
  background-color: var(--color-accent-subtle);
  color: var(--color-accent);
}
```

### الاستجابة

```css
/* Desktop (القيمة الافتراضية) */
.my-element {
  font-size: var(--font-size-lg);
  padding: var(--spacing-xl);
}

/* Tablet */
@media (max-width: 1024px) {
  .my-element {
    font-size: var(--font-size-md);
    padding: var(--spacing-lg);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .my-element {
    font-size: var(--font-size-sm);
    padding: var(--spacing-md);
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .my-element {
    font-size: var(--font-size-xs);
    padding: var(--spacing-sm);
  }
}
```

## 🌍 إضافة ترجمات | Adding Translations

### إضافة مفتاح ترجمة جديد

```typescript
// في src/contexts/LanguageContext.tsx

const translations = {
  ar: {
    // الترجمات العربية
    myNewKey: 'القيمة العربية',
  },
  en: {
    // الترجمات الإنجليزية
    myNewKey: 'English Value',
  },
};
```

### الاستخدام

```typescript
const { t } = useLanguage();
const text = t('myNewKey');
```

## 🔄 تحديث الخدمات | Updating Services

### إضافة دالة جديدة في CertificateService

```typescript
// في src/utils/certificateService.ts

export const CertificateService = {
  // الدوال الموجودة...

  // دالة جديدة
  getValidCertificates: (): Certificate[] => {
    return Array.from(certificateStore.values())
      .filter((cert) => cert.isValid);
  },

  searchCertificates: (query: string): Certificate[] => {
    const lowerQuery = query.toLowerCase();
    return Array.from(certificateStore.values())
      .filter((cert) =>
        cert.studentName.toLowerCase().includes(lowerQuery) ||
        cert.studentID.toLowerCase().includes(lowerQuery)
      );
  },
};
```

## 🧪 الاختبار | Testing

### مثال على اختبار مكون

```typescript
// src/__tests__/Header.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../components/Header';

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('toggles language on button click', async () => {
    render(<Header />);
    const langButton = screen.getByTitle(/language/i);
    await userEvent.click(langButton);
    expect(localStorage.getItem('language')).toBe('ar');
  });
});
```

## 📝 نمط الكود | Code Style

### متغيرات

```typescript
// ✅ حسن
const userName = 'Ahmed';
const isActive = true;
const itemCount = 5;

// ❌ سيء
const user_name = 'Ahmed';
const is_active = true;
const item_count = 5;
```

### الدوال

```typescript
// ✅ حسن
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ سيء
const ct = (items: any[]) => {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
};
```

### التعليقات

```typescript
// ✅ جيد
// حساب إجمالي السعر مع الضرائب
const totalWithTax = total * 1.15;

// ❌ سيء
// هذا يضيف الضريبة
const t = t * 1.15;
```

## 🐛 تصحيح الأخطاء | Debugging

### استخدام الكونسول

```typescript
// معلومات عامة
console.log('User data:', userData);

// تحذيرات
console.warn('This feature is deprecated');

// أخطاء
console.error('Failed to fetch data:', error);

// جداول
console.table(certificates);
```

### React DevTools

```bash
# استخدم React DevTools Browser Extension
# للتحقق من:
# 1. Props والـ State
# 2. Render performance
# 3. Component hierarchy
```

## 🚀 الأداء | Performance

### Lazy Loading للصفحات

```typescript
// في src/App.tsx

import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const IssuePage = lazy(() => import('./pages/IssueCertificatePage'));

// في الـ JSX
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/issue" element={<IssuePage />} />
  </Routes>
</Suspense>
```

### تحسين الصور

```typescript
// استخدم صور معممة
import image from './assets/my-image.webp';

// استخدم srcset للاستجابة
<img
  src="image.webp"
  srcSet="image-small.webp 480w, image.webp 1200w"
  sizes="(max-width: 768px) 480px, 1200px"
  alt="Description"
/>
```

## 📦 البناء والنشر | Build & Deployment

### بناء الإنتاج

```bash
npm run build

# سيُنشئ مجلد dist بالملفات المُحسَّنة
```

### النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر
vercel
```

### النشر على GitHub Pages

```bash
# في package.json
"homepage": "https://username.github.io/repo-name",
"deploy": "npm run build && gh-pages -d dist"

# ثم
npm run deploy
```

## 🔒 متغيرات البيئة | Environment Variables

### ملف .env.local

```bash
# Development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_DEBUG=true

# Production
REACT_APP_API_URL=https://api.example.com
REACT_APP_DEBUG=false
```

### الاستخدام

```typescript
const apiUrl = process.env.REACT_APP_API_URL;
const isDebug = process.env.REACT_APP_DEBUG === 'true';
```

## 📱 اختبار الاستجابة | Testing Responsiveness

### أجهزة محاكاة

```javascript
// في DevTools > Device Toolbar

// أجهزة شائعة للاختبار:
// iPhone 12 (390 × 844)
// iPad (768 × 1024)
// Desktop (1366 × 768)
```

### الاختبار اليدوي

```bash
# تشغيل على شبكة محلية
npm run dev -- --host

# ثم زر الرابط من جهاز آخر:
http://YOUR_IP:5173
```

## 🎓 موارد إضافية | Additional Resources

- [React Hooks API](https://react.dev/reference/react)
- [React Router Advanced](https://reactrouter.com/en/main/start/concepts)
- [TypeScript Tips](https://www.typescriptlang.org/docs/handbook/tips.html)
- [CSS Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS/Tips)
- [Web Accessibility](https://www.w3.org/WAI/fundamentals)

---

**هذا الدليل يتم تحديثه باستمرار. تأكد من الرجوع إليه عند الحاجة**
