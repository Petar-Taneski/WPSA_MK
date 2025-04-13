import { useTranslation } from "react-i18next";

const FullWidthImage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[50vh] overflow-hidden">
      <img
        src="/images/about/chickens.jpg"
        alt="Chickens eating grain"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 w-full h-full flex items-center justify-center">
        <div className="text-center p-12 w-full h-full backdrop-blur-xs items-center justify-center flex bg-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-5 md:self-center">
                <h2 className="text-3xl text-white mb-6">
                  {t("about.shortName")}
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-white text-lg leading-relaxed p-6 border-l-2 border-gray-200">
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
