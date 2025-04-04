import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  // Load translation using HTTP
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: "en",
    debug: true,
    supportedLngs: ["en", "mk"],

    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // Backend options
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // Detect language
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },
  });

export default i18n;
