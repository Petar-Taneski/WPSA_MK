import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";

interface NavigationProps {
  openContactModal: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ openContactModal }) => {
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
    <header className="max-[1024px]:hidden px-[5vw] h-[13vh] fixed w-screen top-0 z-50 bg-white shadow-[0_4px_15px_-3px] shadow-primary/40">
      <div className="container flex items-center justify-between h-full mx-auto ">

          <Link to="/">
            <img
              src="/Logo-WPSA.png"
              alt="WPSA Logo"
              className="h-[10vh] mr-6 mix-blend-multiply"
            />
          </Link>
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={`/${currentLang}/${t(`pages.${item.key}`)}`}
                className="px-3 py-2 text-lg font-medium rounded-md text-gray-800/85 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={openContactModal}
              className="px-3 py-2 text-lg font-medium rounded-md text-gray-800/85 hover:text-primary"
            >
              {t("navigation.contact")}
            </button>
          </div>
     
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Navigation;
