import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    // Get the current path segments
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Get the language segment (first segment)
    const currentLang = pathSegments[0] || i18n.language;

    // Get the current page (second segment or empty for home)
    const currentPage = pathSegments[1] || "home";

    // Get translated page name from translations
    const translatedPage = t(`pages.${currentPage}`);

    // Build new path with new language
    const newPath = `/${lng}/${translatedPage}`;

    // Change language
    i18n.changeLanguage(lng);

    // Navigate to translated route
    navigate(newPath);
  };

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="p-2 bg-white border rounded-md"
      >
        <option value="en">{t("languages.en")}</option>
        <option value="mk">{t("languages.mk")}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
