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
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-40% to-black/60 flex items-center justify-end">
          <div className="flex flex-col gap-2 pr-10 text-right w-200">
            <h1 className="sm:text-2xl text-xl font-bold text-white/80">
              {t("about.nameFirstPart")}
            </h1>
            <h1 className="sm:text-2xl text-xl -mt-2 font-bold text-white/80">
              {t("about.nameSecondPart")}
            </h1>
            <span className="break-words text-gray-200/80 "></span>
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
