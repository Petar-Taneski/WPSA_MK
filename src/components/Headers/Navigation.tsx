import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";
import "../Headers/MobileHeader/navigation.css";

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

  // Function to check if a nav item is active
  const isItemActive = (itemKey: string) => {
    // Normalize the current path (decode URL-encoded characters)
    const normalizedPath = decodeURIComponent(location.pathname);

    // Get the translated path for this item
    const itemPath = t(`pages.${itemKey}`, { lng: currentLang });

    // Special case for home
    if (itemKey === "home") {
      return (
        normalizedPath === `/${currentLang}` ||
        normalizedPath === `/${currentLang}/${itemPath}`
      );
    }

    // Check for exact path match (after normalization)
    if (normalizedPath === `/${currentLang}/${itemPath}`) {
      return true;
    }

    // Check for news item detail pages
    if (itemKey === "news") {
      // For English news detail pages
      if (currentLang === "en" && normalizedPath.includes("/news/")) {
        return true;
      }

      // For Macedonian news detail pages - handle Cyrillic "вести" consistently
      if (
        currentLang === "mk" &&
        (normalizedPath.includes("/вести/") ||
          normalizedPath.includes("/%D0%B2%D0%B5%D1%81%D1%82%D0%B8/"))
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <header className="max-[1024px]:hidden px-[5vw] h-[13vh] fixed w-screen top-0 z-50 bg-white shadow-[0_4px_15px_-3px] shadow-primary/40">
      <div className="flex items-center justify-between w-full h-full">
        <Link to="/">
          <img
            src="/Logo-WPSA.svg"
            alt="WPSA Logo"
            className="h-[10vh] mr-6 mix-blend-multiply"
          />
        </Link>
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const path = `/${currentLang}/${t(`pages.${item.key}`, {
              lng: currentLang,
            })}`;
            return (
              <Link
                key={item.key}
                to={path}
                className={`px-3 py-2 text-lg rounded-md ${
                  isItemActive(item.key)
                    ? "nav-item-active font-bold !text-primary"
                    : "font-medium text-gray-800/85 hover:text-primary"
                }`}
                style={{
                  color: isItemActive(item.key)
                    ? "var(--color-primary, #4F46E5)"
                    : "",
                  fontWeight: isItemActive(item.key) ? "700" : "500",
                }}
              >
                {item.label}
              </Link>
            );
          })}
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
