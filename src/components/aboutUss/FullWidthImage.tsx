import { useTranslation } from "react-i18next";

const FullWidthImage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="relative w-full h-[50vh] overflow-hidden max-md:hidden">
      <img
        src="/images/about/chickens.jpg"
        alt="Chickens eating grain"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 w-full h-full flex items-center justify-center">
        <div className="text-center p-12 w-full h-full backdrop-blur-xs items-center justify-center flex bg-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div
              className={`${
                i18n.language === "en"
                  ? "grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10"
                  : ""
              }`}
            >
              <div
                className={`md:col-span-4 ${
                  i18n.language === "en" ? "" : "hidden"
                } lg:col-span-5 md:self-center`}
              >
                <h2 className="text-3xl text-white">{t("about.shortName")}</h2>
              </div>
              <div className="md:col-span-8 lg:col-span-7">
                <p
                  className={`text-white text-lg xl:text-xl leading-relaxed md:p-6  ${
                    i18n.language === "en"
                      ? "md:border-l-2 border-gray-200"
                      : "lg:w-3/4 mx-auto"
                  }`}
                >
                  {t("about.partners.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullWidthImage;
