# 📜 نظام التحقق من الشهادات عبر البلوكشين

## 🌟 نظرة عامة

نظام متطور لإصدار والتحقق من الشهادات الرقمية باستخدام تقنية البلوكشين، مع واجهة ويب احترافية وآمنة.

## ✨ المميزات الرئيسية

- ✅ **تصميم احترافي** - وضع ليلي/نهاري + استجابة كاملة
- ✅ **دعم اللغات** - العربية والإنجليزية مع RTL/LTR
- ✅ **نظام مصادقة** - OAuth مع Google و GitHub و Microsoft
- ✅ **لوحة تحكم** - إحصائيات وسجل النشاط
- ✅ **إدارة الشهادات** - إصدار وتحقق وعرض

## 🚀 البدء السريع

```bash
npm install
npm run dev
```

انظر `QUICK_START.md` للمزيد من التفاصيل.

## 📖 الموارد التوثيقية

- 📘 `QUICK_START.md` - البدء السريع
- 📕 `FRONTEND_GUIDE.md` - دليل الواجهة
- 📙 `DEVELOPMENT_GUIDE.md` - دليل التطوير
- 📗 `AUTHENTICATION_GUIDE.md` - نظام المصادقة

## 🔐 متطلبات البيئة

أنشئ `.env.local`:
```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
