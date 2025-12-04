import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    home: 'الرئيسية',
    issue: 'إصدار شهادة',
    verify: 'التحقق',
    details: 'التفاصيل',
    language: 'العربية',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',

    // Hero
    heroTitle: 'نظام التحقق من الشهادات القائم على البلوكشين',
    heroSubtitle: 'نظام آمن وموثوق لإصدار والتحقق من الشهادات الأكاديمية والمهنية',
    issueCert: 'إصدار شهادة',
    verifyCert: 'التحقق من شهادة',

    // How it works
    howItWorks: 'كيفية عمل النظام',
    howItWorksDesc: 'نظام متطور يدمج بين البلوكشين والتخزين الموزع',
    step1: 'تحميل البيانات',
    step1Desc: 'يتم تحميل بيانات الشهادة والملف الأصلي',
    step2: 'التخزين الآمن',
    step2Desc: 'حفظ الملف على IPFS والبيانات على البلوكشين',
    step3: 'التحقق الفوري',
    step3Desc: 'أي شخص يمكنه التحقق من أصالة الشهادة',

    // Why blockchain
    whyBlockchain: 'لماذا النظام القائم على البلوكشين؟',
    secure: 'آمن وموثوق',
    secureDesc: 'لا يمكن تعديل البيانات بعد التسجيل',
    transparent: 'شفاف وقابل للتدقيق',
    transparentDesc: 'جميع العمليات مسجلة وقابلة للتتبع',
    immutable: 'دائم ولا يمكن حذفه',
    immutableDesc: 'الشهادات محفوظة للأبد على البلوكشين',
    decentralized: 'لامركزي',
    decentralizedDesc: 'لا توجد جهة واحدة تتحكم في البيانات',

    // Issue Certificate Page
    issueCertTitle: 'إصدار شهادة جديدة',
    studentName: 'اسم الطالب',
    studentID: 'رقم الطالب',
    specialization: 'التخصص',
    graduationYear: 'سنة التخرج',
    uploadPDF: 'رفع ملف PDF',
    dragDrop: 'اسحب الملف هنا أو انقر للاختيار',
    issueCertBtn: 'إصدار الشهادة',
    loading: 'جاري المعالجة...',
    success: 'تم إصدار الشهادة بنجاح!',
    certificateID: 'معرّف الشهادة',
    copyID: 'نسخ المعرّف',
    copied: 'تم النسخ',

    // Verify Certificate Page
    verifyCertTitle: 'التحقق من الشهادة',
    enterCertID: 'أدخل معرّف الشهادة',
    verifyCertBtn: 'التحقق',
    certificateValid: 'الشهادة صحيحة ✓',
    certificateFraud: 'الشهادة مزورة ✗',
    certificateNotFound: 'الشهادة غير موجودة !',
    certificateDetails: 'تفاصيل الشهادة',
    name: 'الاسم',
    major: 'التخصص',
    year: 'السنة',
    ipfsLink: 'رابط IPFS',
    downloadPDF: 'تنزيل PDF',

    // Certificate Details
    certificateDetailsTitle: 'تفاصيل الشهادة',
    issuedDate: 'تاريخ الإصدار',
    ipfsCID: 'معرّف IPFS',
    blockchainHash: 'بصمة البلوكشين',
    verifyOnBlockchain: 'التحقق على البلوكشين',

    // Footer
    copyright: 'جميع الحقوق محفوظة',
    currentYear: '2024',
  },
  en: {
    // Header
    home: 'Home',
    issue: 'Issue',
    verify: 'Verify',
    details: 'Details',
    language: 'English',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',

    // Hero
    heroTitle: 'Blockchain-Based Certificate Verification System',
    heroSubtitle: 'A secure and reliable system for issuing and verifying academic and professional certificates',
    issueCert: 'Issue Certificate',
    verifyCert: 'Verify Certificate',

    // How it works
    howItWorks: 'How It Works',
    howItWorksDesc: 'An advanced system that combines blockchain and distributed storage',
    step1: 'Upload Data',
    step1Desc: 'Upload certificate data and original file',
    step2: 'Secure Storage',
    step2Desc: 'Save file on IPFS and data on blockchain',
    step3: 'Instant Verification',
    step3Desc: 'Anyone can verify the authenticity of the certificate',

    // Why blockchain
    whyBlockchain: 'Why Blockchain-Based System?',
    secure: 'Secure & Reliable',
    secureDesc: 'Data cannot be modified after registration',
    transparent: 'Transparent & Auditable',
    transparentDesc: 'All operations are recorded and traceable',
    immutable: 'Permanent & Immutable',
    immutableDesc: 'Certificates are preserved forever on blockchain',
    decentralized: 'Decentralized',
    decentralizedDesc: 'No single entity controls the data',

    // Issue Certificate Page
    issueCertTitle: 'Issue New Certificate',
    studentName: 'Student Name',
    studentID: 'Student ID',
    specialization: 'Specialization',
    graduationYear: 'Graduation Year',
    uploadPDF: 'Upload PDF',
    dragDrop: 'Drag file here or click to select',
    issueCertBtn: 'Issue Certificate',
    loading: 'Processing...',
    success: 'Certificate issued successfully!',
    certificateID: 'Certificate ID',
    copyID: 'Copy ID',
    copied: 'Copied',

    // Verify Certificate Page
    verifyCertTitle: 'Verify Certificate',
    enterCertID: 'Enter Certificate ID',
    verifyCertBtn: 'Verify',
    certificateValid: 'Certificate Valid ✓',
    certificateFraud: 'Certificate Fraudulent ✗',
    certificateNotFound: 'Certificate Not Found !',
    certificateDetails: 'Certificate Details',
    name: 'Name',
    major: 'Major',
    year: 'Year',
    ipfsLink: 'IPFS Link',
    downloadPDF: 'Download PDF',

    // Certificate Details
    certificateDetailsTitle: 'Certificate Details',
    issuedDate: 'Issued Date',
    ipfsCID: 'IPFS ID',
    blockchainHash: 'Blockchain Hash',
    verifyOnBlockchain: 'Verify on Blockchain',

    // Footer
    copyright: 'All Rights Reserved',
    currentYear: '2024',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
