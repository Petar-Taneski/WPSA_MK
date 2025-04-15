import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface LowerSectionProps {
  openContactModal: () => void;
}

const LowerSection: React.FC<LowerSectionProps> = ({ openContactModal }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Navigation items with their respective route keys
  const navItems = [
    { key: "home", label: t("navigation.home") },
    { key: "about", label: t("navigation.about") },
    { key: "news", label: t("navigation.news") },
    { key: "events", label: t("navigation.events") },
  ];
  const currentLang = location.pathname.split("/")[1] || i18n.language;

  return (
    <div className="max-lg:hidden px-[5vw] h-[15vh] w-screen z-50 bg-white ">
      <div className="container flex items-center justify-between h-full mx-auto ">
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
              className="px-3 py-2 text-lg font-medium text-gray-800 rounded-md hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={openContactModal}
            className="px-3 py-2 text-lg font-medium text-gray-800 rounded-md hover:text-primary"
          >
            {t("navigation.contact") || "Contact"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowerSection;
