"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageCode = "en" | "hi" | "te" | "ta" | "ar" | "ur" | "ml" | "mr";

interface Translations {
  [key: string]: string;
}

interface LanguageData {
  name: string;
  nativeName: string;
  speechCode: string;
  dir: "ltr" | "rtl";
  translations: Translations;
}

const languages: Record<LanguageCode, LanguageData> = {
  en: {
    name: "English",
    nativeName: "English",
    speechCode: "en-US",
    dir: "ltr",
    translations: {
      "nav.home": "Discover",
      "nav.aiStylist": "Style Studio",
      "nav.collections": "Collections",
      "nav.shop": "Boutique",
      "nav.newArrivals": "New Arrivals",
      "nav.trending": "Trending",
      "cat.sneakers": "Sneakers",
      "cat.accessories": "Accessories",
      "cat.watches": "Watches",
      "cat.bags": "Bags",
      "cat.brands": "Brands",
      "bot.luxePlus": "LUXE THREADS Plus",
      "bot.whatsappPrimary": "WhatsApp (Primary)",
      "bot.whatsappAlt": "WhatsApp (Alt)",
      "bot.settings": "Settings",
      "nav.editorial": "Editorial",
      "chat.placeholder": "Ask LUXE THREADS...",
      "chat.online": "System Sync Online",
      "chat.listening": "Listening...",
      "hero.titleThe": "THE",
      "hero.titleArchive": "ARCHIVE.",
      "hero.subtitle": "Created by LUXE THREADS Intelligence. Engineered for the future. Explore the global wardrobe.",
      "hero.exploreNow": "Explore Now",
      "hero.styleMatch": "STYLE MATCH",
      "hero.trending": "TRENDING",
      "hero.aiRecommended": "AI RECOMMENDED",
    }
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    speechCode: "hi-IN",
    dir: "ltr",
    translations: {
      "nav.home": "होम",
      "nav.aiStylist": "एआई स्टाइलिस्ट",
      "nav.collections": "कलेक्शन",
      "nav.shop": "शॉप",
      "nav.newArrivals": "न्यू अराइवल्स",
      "nav.trending": "ट्रेंडिंग",
      "cat.sneakers": "स्नीकर्स",
      "cat.accessories": "एक्सेसरीज़",
      "cat.watches": "वॉचेस",
      "cat.bags": "बैग्स",
      "cat.brands": "ब्रांड्स",
      "bot.luxePlus": "लक्स प्लस",
      "bot.whatsappPrimary": "व्हाट्सएप (मुख्य)",
      "bot.whatsappAlt": "व्हाट्सएप (वैकल्पिक)",
      "bot.settings": "सेटिंग्स",
      "nav.editorial": "एडिटोरियल",
      "chat.placeholder": "लक्स एआई से पूछें...",
      "chat.online": "सिस्टम ऑनलाइन",
      "chat.listening": "सुन रहा हूँ...",
    }
  },
  te: {
    name: "Telugu",
    nativeName: "తెలుగు",
    speechCode: "te-IN",
    dir: "ltr",
    translations: {
      "nav.home": "హోమ్",
      "nav.aiStylist": "ఏఐ స్టైలిస్ట్",
      "nav.collections": "కలెక్షన్స్",
      "nav.shop": "షాప్",
      "nav.newArrivals": "కొత్త రాక",
      "nav.trending": "ట్రెండింగ్",
      "cat.sneakers": "స్నీకర్స్",
      "cat.accessories": "ఉపకరణాలు",
      "cat.watches": "గడియారాలు",
      "cat.bags": "బ్యాగులు",
      "cat.brands": "బ్రాండ్స్",
      "bot.luxePlus": "లక్స్ ప్లస్",
      "bot.whatsappPrimary": "వాట్సాప్ (ప్రాథమిక)",
      "bot.whatsappAlt": "వాట్సాప్ (ప్రత్యామ్నాయ)",
      "bot.settings": "సెట్టింగ్స్",
      "nav.editorial": "సంపాదకీయం",
      "chat.placeholder": "లక్స్ ఏఐని అడగండి...",
      "chat.online": "సిస్టమ్ సింక్ ఆన్‌లైన్",
      "chat.listening": "వింటున్నాను...",
    }
  },
  ta: {
    name: "Tamil",
    nativeName: "தமிழ்",
    speechCode: "ta-IN",
    dir: "ltr",
    translations: {
      "nav.home": "முகப்பு",
      "nav.aiStylist": "AI ஸ்டைலிஸ்ட்",
      "nav.collections": "தொகுப்புகள்",
      "nav.shop": "கடை",
      "nav.newArrivals": "புதியவை",
      "nav.trending": "பிரபலமானவை",
      "cat.sneakers": "ஸ்னீக்கர்ஸ்",
      "cat.accessories": "பாகங்கள்",
      "cat.watches": "கடிகாரங்கள்",
      "cat.bags": "பைகள்",
      "cat.brands": "பிராண்டுகள்",
      "bot.luxePlus": "லக்ஸ் பிளஸ்",
      "bot.whatsappPrimary": "வாட்ஸ்அப் (முதன்மை)",
      "bot.whatsappAlt": "வாட்ஸ்அப் (மாற்று)",
      "bot.settings": "அமைப்புகள்",
      "nav.editorial": "தலையங்கம்",
      "chat.placeholder": "லக்ஸ் AI-யிடம் கேளுங்கள்...",
      "chat.online": "சிஸ்டம் ஆன்லைன்",
      "chat.listening": "கேட்கிறேன்...",
    }
  },
  ar: {
    name: "Arabic",
    nativeName: "العربية",
    speechCode: "ar-SA",
    dir: "rtl",
    translations: {
      "nav.home": "الرئيسية",
      "nav.aiStylist": "منسق الذكاء الاصطناعي",
      "nav.collections": "مجموعات",
      "nav.shop": "متجر",
      "nav.newArrivals": "وصل حديثاً",
      "nav.trending": "رائج",
      "cat.sneakers": "أحذية",
      "cat.accessories": "إكسسوارات",
      "cat.watches": "ساعات",
      "cat.bags": "حقائب",
      "cat.brands": "ماركات",
      "bot.luxePlus": "لوكس بلس",
      "bot.whatsappPrimary": "واتساب (الرئيسي)",
      "bot.whatsappAlt": "واتساب (البديل)",
      "bot.settings": "إعدادات",
      "nav.editorial": "الافتتاحية",
      "chat.placeholder": "اسأل لوكس الذكاء الاصطناعي...",
      "chat.online": "النظام متصل",
      "chat.listening": "جاري الاستماع...",
    }
  },
  ur: {
    name: "Urdu",
    nativeName: "اردو",
    speechCode: "ur-PK",
    dir: "rtl",
    translations: {
      "nav.home": "ہوم",
      "nav.aiStylist": "اے آئی سٹائلسٹ",
      "nav.collections": "کلیکشن",
      "nav.shop": "شاپ",
      "nav.newArrivals": "نیو ارائیولز",
      "nav.trending": "ٹرینڈنگ",
      "cat.sneakers": "سنیکرز",
      "cat.accessories": "ایکسیسریز",
      "cat.watches": "واچز",
      "cat.bags": "بیگز",
      "cat.brands": "برانڈز",
      "bot.luxePlus": "لکس پلس",
      "bot.whatsappPrimary": "واٹس ایپ (مرکزی)",
      "bot.whatsappAlt": "واٹس ایپ (متبادل)",
      "bot.settings": "سیٹنگز",
      "nav.editorial": "ایڈیٹوریل",
      "chat.placeholder": "لکس اے آئی سے پوچھیں...",
      "chat.online": "سسٹم آن لائن ہے",
      "chat.listening": "سن رہا ہے...",
    }
  },
  ml: {
    name: "Malayalam",
    nativeName: "മലയാളം",
    speechCode: "ml-IN",
    dir: "ltr",
    translations: {
      "nav.home": "ഹോം",
      "nav.aiStylist": "AI സ്റ്റൈലിസ്റ്റ്",
      "nav.collections": "ശേഖരങ്ങൾ",
      "nav.shop": "ഷോപ്പ്",
      "nav.newArrivals": "പുതിയവ",
      "nav.trending": "ട്രെൻഡിംഗ്",
      "cat.sneakers": "സ്നീക്കേഴ്സ്",
      "cat.accessories": "ആക്സസറികൾ",
      "cat.watches": "വാച്ചുകൾ",
      "cat.bags": "ബാഗുകൾ",
      "cat.brands": "ബ്രാൻഡുകൾ",
      "bot.luxePlus": "ലക്സ് പ്ലസ്",
      "bot.whatsappPrimary": "വാട്ട്‌സ്ആപ്പ് (പ്രധാന)",
      "bot.whatsappAlt": "വാട്ട്‌സ്ആപ്പ് (അപരൻ)",
      "bot.settings": "സജ്ജീകരണങ്ങൾ",
      "nav.editorial": "എഡിറ്റോറിയൽ",
      "chat.placeholder": "ലക്സ് AI-യോട് ചോദിക്കുക...",
      "chat.online": "സിസ്റ്റം ഓൺലൈൻ",
      "chat.listening": "കേൾക്കുന്നു...",
    }
  },
  mr: {
    name: "Marathi",
    nativeName: "मराठी",
    speechCode: "mr-IN",
    dir: "ltr",
    translations: {
      "nav.home": "मुख्यपृष्ठ",
      "nav.aiStylist": "एआय स्टायलिस्ट",
      "nav.collections": "संग्रह",
      "nav.shop": "दुकान",
      "nav.newArrivals": "नवीन आगमन",
      "nav.trending": "ट्रेंडिंग",
      "cat.sneakers": "स्नीकर्स",
      "cat.accessories": "अॅक्सेसरीज",
      "cat.watches": "घड्याळे",
      "cat.bags": "पिशव्या",
      "cat.brands": "ब्रँड्स",
      "bot.luxePlus": "लक्स प्लस",
      "bot.whatsappPrimary": "व्हॉट्सअॅप (मुख्य)",
      "bot.whatsappAlt": "व्हॉट्सअॅप (पर्यायी)",
      "bot.settings": "सेटिंग्ज",
      "nav.editorial": "संपादकीय",
      "chat.placeholder": "लक्स एआयला विचारा...",
      "chat.online": "सिस्टम ऑनलाइन",
      "chat.listening": "ऐकत आहे...",
    }
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  currentLangData: LanguageData;
  availableLanguages: { code: LanguageCode; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("luxe-language") as LanguageCode;
    if (savedLang && languages[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem("luxe-language", lang);
    document.documentElement.dir = languages[lang].dir; // Support RTL
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return languages[language].translations[key] || languages["en"].translations[key] || key;
  };

  const availableLanguages = (Object.keys(languages) as LanguageCode[]).map(code => ({
    code,
    nativeName: languages[code].nativeName
  }));

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      currentLangData: languages[language],
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

