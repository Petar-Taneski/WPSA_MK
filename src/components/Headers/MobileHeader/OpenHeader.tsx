import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
// import { isSafari } from "react-device-detect";

const OpenHeader = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [animateOpen, setAnimateOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navItems = [
    { key: "home", label: t("navigation.home") },
    { key: "about", label: t("navigation.about") },
    { key: "news", label: t("navigation.news") },
    { key: "events", label: t("navigation.events") },
  ];

  const currentLang = location.pathname.split("/")[1] || i18n.language;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setVisible(true);
      timeout = setTimeout(() => {
        setAnimateOpen(true);
      }, 10);
    } else {
      setAnimateOpen(false);
      timeout = setTimeout(() => {
        setVisible(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 z-[1000] h-screen bg-white px-[5vw] ${
        visible ? "block" : "hidden"
      }`}
    >
      <div
        className={`pb-[10vh]flex flex-col items-center pt-[93px] justify-center px-[5vw] bg-amala-purple transition-all ease-in-out duration-500 z-[300] overflow-x-clip ${
          animateOpen ? "w-screen opacity-100" : "w-0 opacity-0"
        } h-full `}
      >
        <div className="w-full justify-self-center tablet:space-y-[5vh]">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={`/${currentLang}/${t(`pages.${item.key}`)}`}
                className="flex items-center text-primary text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenHeader;
