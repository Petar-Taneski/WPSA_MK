import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";

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
    <header className="max-[1024px]:hidden px-[5vw] h-[13vh] sticky top-0 z-50 bg-white shadow-[0_4px_15px_-3px] shadow-primary/40">
      <div className="container mx-auto h-full flex justify-between items-center ">
        <div className="flex items-center ">
          <img
            src="/Logo-WPSA.png"
            alt="WPSA Logo"
            className="h-[10vh] mr-6 mix-blend-multiply"
          />
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={`/${currentLang}/${t(`pages.${item.key}`)}`}
                className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-lg font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Navigation;
