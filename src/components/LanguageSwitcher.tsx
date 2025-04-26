import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

// Define types for the page key mapping
interface PageKeyMap {
  [key: string]: string;
}

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = () => {
    // Get the current path segments
    const pathSegments = location.pathname.split("/").filter(Boolean);
    console.log("Current path:", location.pathname);
    console.log("Path segments:", pathSegments);

    // Determine the next language (toggle between 'en' and 'mk')
    const nextLang = i18n.language === "en" ? "mk" : "en";

    // Get the route key by matching the current URL segment to a known route
    const currentLang = pathSegments[0]; // 'en' or 'mk'
    // URL decode the current page slug to handle encoded characters like spaces
    const currentPageSlug = pathSegments[1]
      ? decodeURIComponent(pathSegments[1])
      : "home";

    // Map of Macedonian page slugs to their page keys
    const mkPageKeyMap: PageKeyMap = {
      почетна: "home",
      "за нас": "about",
      вести: "news",
      настани: "events",
      // Add other page mappings as needed
    };

    // Reverse mapping for direct slug lookup (for handling encoding differences)
    const pageKeysToCheck = ["home", "about", "news", "events"];

    // Get the correct page key based on the current language and slug
    let pageKey = currentPageSlug;

    if (currentLang === "mk") {
      // First try direct mapping
      if (mkPageKeyMap[currentPageSlug]) {
        pageKey = mkPageKeyMap[currentPageSlug];
      } else {
        // Fallback: try to match by comparing with translated values
        for (const key of pageKeysToCheck) {
          const translatedValue = t(`pages.${key}`, { lng: "mk" });
          if (currentPageSlug === translatedValue) {
            pageKey = key;
            break;
          }
        }
      }
      console.log(
        "Found page key:",
        pageKey,
        "for Macedonian slug:",
        currentPageSlug
      );
    }

    // Change the language first
    i18n.changeLanguage(nextLang);

    // Get translated page name for the next language using the correct key
    const translatedPage = t(`pages.${pageKey}`);

    // Build new path with new language
    const newPath = `/${nextLang}/${translatedPage}`;

    // Navigate to translated route
    navigate(newPath);
  };

  // Determine flag image based on current language
  const flagImage = i18n.language === "mk" ? "gb.svg" : "mk.svg";

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
