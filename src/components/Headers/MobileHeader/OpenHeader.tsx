import { ArrowRight, ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

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

  // Get current page path without language prefix
  const currentPath = location.pathname.split("/").slice(2).join("/");

  // Function to check if a nav item is active
  const isItemActive = (itemKey: string) => {
    // Special case for home
    if (
      itemKey === "home" &&
      (location.pathname === `/${currentLang}` ||
        location.pathname ===
          `/${currentLang}/${t(`pages.home`, { lng: currentLang })}`)
    ) {
      return true;
    }

    // Check for exact path match first
    if (currentPath === t(`pages.${itemKey}`, { lng: currentLang })) {
      return true;
    }

    // Check for news item detail pages
    if (
      itemKey === "news" &&
      ((currentLang === "en" && location.pathname.includes("/news/")) ||
        (currentLang === "mk" && location.pathname.includes("/вести/")))
    ) {
      return true;
    }

    return false;
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
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
                    ? "font-bold text-primary/85"
                    : "font-medium text-gray-800/85"
                }`}
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
        <div className="mt-8 flex justify-center">
          <div className="w-full relative">
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full text-gray-800/85 font-medium bg-transparent border-none focus:outline-none focus:ring-0 pl-0 pr-8 appearance-none [&>option]:bg-white [&>option]:text-gray-800/85 [&>option]:p-0 [&>option]:m-0"
            >
              <option value="en">{t("languages.en")}</option>
              <option value="mk">{t("languages.mk")}</option>
            </select>
            <ChevronDown className="absolute right-0 w-4 h-4 -translate-y-1/2 pointer-events-none top-1/2 text-gray-800/85" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenHeader;
