import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "../../LanguageSwitcher";

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === `/${currentLang}/${t("pages.home")}`) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="block lg:hidden">
      <div className="fixed top-0 w-full flex items-center justify-between min-h-[70px] h-[13vh] max-h-[15vh] z-[1000] bg-white shadow-[0_4px_15px_-3px] shadow-primary/40 px-[5vw]">
        <Link
          to={`/${currentLang}/${t("pages.home")}`}
          onClick={handleLogoClick}
        >
          <img
            src="/Logo-WPSA.png"
            alt="WPSA Logo"
            className="h-[8vh] mix-blend-multiply"
          />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex flex-col justify-center items-center w-8 h-8"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-[0.3rem]" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 my-1 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-[0.3rem]" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white z-[999] pt-[13vh] px-[5vw] transition-all duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <nav className="flex flex-col space-y-6 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={`/${currentLang}/${t(`pages.${item.key}`)}`}
              className="text-2xl font-medium text-gray-800 hover:text-primary flex justify-between items-center border-b border-gray-200 pb-3"
              onClick={() => setIsOpen(false)}
            >
              <span>{item.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-12 w-[calc(100%-10vw)]">
          <div className="flex justify-center mb-6">
            <LanguageSwitcher />
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} WPSA MK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
