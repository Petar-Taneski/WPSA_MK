import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = () => {
    // Get the current path segments
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Determine the next language (toggle between 'en' and 'mk')
    const nextLang = i18n.language === "en" ? "mk" : "en";

    // Get the current page (second segment or empty for home)
    const currentPage = pathSegments[1] || "home";

    // Get translated page name for the next language
    i18n.changeLanguage(nextLang);
    const translatedPage = t(`pages.${currentPage}`);

    // Build new path with new language
    const newPath = `/${nextLang}/${translatedPage}`;

    // Navigate to translated route
    navigate(newPath);
  };

  // Determine flag image based on current language
  const flagImage = i18n.language === "en" ? "gb.svg" : "mk.svg";

  return (
    <div className="language-switcher">
      <button
        onClick={changeLanguage}
        className="flex items-center justify-center p-2 cursor-pointer"
        aria-label={t("switchTo", {
          lang: i18n.language === "en" ? t("languages.mk") : t("languages.en"),
        })}
      >
        <img
          src={`/images/langs/${flagImage}`}
          alt={i18n.language}
          className="w-auto h-5"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
