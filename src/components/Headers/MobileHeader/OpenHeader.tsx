import { ArrowRight, ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const OpenHeader = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navItems = [
    { key: "home", label: t("navigation.home") },
    { key: "about", label: t("navigation.about") },
    { key: "news", label: t("navigation.news") },
    { key: "events", label: t("navigation.events") },
  ];

  const currentLang = location.pathname.split("/")[1] || i18n.language;

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
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={`/${currentLang}/${t(`pages.${item.key}`)}`}
              className={`flex items-center justify-between w-full gap-2 py-3 text-primary font-medium rounded-sm shadow-b-lg`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="w-full relative">
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full text-primary font-medium bg-transparent border-none focus:outline-none focus:ring-0 pl-0 pr-8 appearance-none [&>option]:bg-white [&>option]:text-primary [&>option]:p-0 [&>option]:m-0"
            >
              <option value="en">{t("languages.en")}</option>
              <option value="mk">{t("languages.mk")}</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenHeader;
