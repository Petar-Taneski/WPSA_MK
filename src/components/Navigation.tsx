import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Navigation items with their respective route keys
  const navItems = [
    { key: "home", label: t("navigation.home") },
    { key: "about", label: t("navigation.about") },
    { key: "news", label: t("navigation.news") },
    { key: "events", label: t("navigation.events") },
  ];

  // Get current language from URL or i18n
  const currentLang = location.pathname.split("/")[1] || i18n.language;

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={`/${currentLang}/${t(`pages.${item.key}`)}`}
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default Navigation;
