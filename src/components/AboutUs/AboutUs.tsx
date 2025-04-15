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
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-40% to-black/60 flex items-center justify-end md:pr-12">
          <div className="flex flex-col gap-2 pr-10 text-right w-100">
            <h1 className="text-6xl font-extrabold text-white">
              {t("about.shortName")}
            </h1>
            <span className="break-words text-gray-200/80 ">
              {t("about.name")}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-20 pt-10 max-sm:px-6 max-md:px-10">
        <AboutContent />
      </div>
    </div>
  );
};

export default AboutUs;
