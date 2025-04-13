import { useTranslation } from "react-i18next";
import AboutContent from "./AboutContent";

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="/images/about/header-chicks.png"
          alt="WPSA Macedonian Branch"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-40% to-black/60 flex items-center justify-end pr-12">
          <div className="flex flex-col pr-10 gap-2 w-100 text-right">
            <h1 className="text-6xl font-extrabold text-white">
              {t("about.shortName")}
            </h1>
            <span className="text-gray-200/80 break-words ">
              {t("about.name")}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-10 w-full px-20">
        <AboutContent />
      </div>
    </div>
  );
};

export default AboutUs;
