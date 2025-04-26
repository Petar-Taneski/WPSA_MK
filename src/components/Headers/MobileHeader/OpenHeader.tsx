import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "./navigation.css";

interface OpenHeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openContactModal: () => void;
}

const OpenHeader: React.FC<OpenHeaderProps> = ({
  isOpen,
  setIsOpen,
  openContactModal,
}: OpenHeaderProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navItems = [
    { key: "home", label: t("navigation.home") },
    { key: "about", label: t("navigation.about") },
    { key: "news", label: t("navigation.news") },
    { key: "events", label: t("navigation.events") },
  ];

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

  const handleLanguageChange = () => {
    // Toggle language
    const nextLang = i18n.language === "en" ? "mk" : "en";
    i18n.changeLanguage(nextLang);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 z-[1000] bg-white/95 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className={`pb-[10vh] flex flex-col h-screen pt-[93px] justify-center px-[5vw] bg-amala-purple z-[300] overflow-x-clip ${
          isOpen ? "w-screen" : "w-0"
        } h-full`}
      >
        <div className="flex flex-col space-y-5">
          {navItems.map((item) => {
            const path = `/${currentLang}/${t(`pages.${item.key}`, {
              lng: currentLang,
            })}`;
            return (
              <Link
                key={item.key}
                to={path}
                className={`flex items-center justify-between w-full gap-2 py-3 text-lg rounded-md ${
                  isItemActive(item.key)
                    ? "nav-item-active font-bold !text-primary"
                    : "nav-item font-medium text-gray-800/85"
                }`}
                style={{
                  color: isItemActive(item.key)
                    ? "var(--color-primary, #4F46E5)"
                    : "",
                  fontWeight: isItemActive(item.key) ? "700" : "500",
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            );
          })}
        </div>
        <div className="mt-5">
          <button
            onClick={() => {
              openContactModal();
              setIsOpen(false);
            }}
            className={`flex items-center justify-between w-full gap-2 py-3 text-lg font-medium rounded-md text-gray-800/85 `}
          >
            {t("navigation.contact")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="flex justify-center mt-8">
          <div className="flex justify-end w-full">
            <button
              onClick={handleLanguageChange}
              className="flex items-center justify-center p-2 "
              aria-label={
                i18n.language === "en" ? t("languages.mk") : t("languages.en")
              }
            >
              <img
                src={`/images/langs/${
                  i18n.language === "mk" ? "gb.svg" : "mk.svg"
                }`}
                alt={i18n.language}
                className="w-auto h-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenHeader;
