import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden">
      {/* Parallax hero section */}
      <div className="overflow-hidden">
        {/* Parallax background div - full screen width */}
        <div
          className="parallax"
          style={{ backgroundImage: "url('/images/header.png')" }}
        >
          {/* Content overlay */}
          <div className="h-full min-h-screen flex items-center justify-center text-white">
            <div className="container mx-auto px-4">
              <div className="flex flex-col pr-10 gap-2 pb-30 w-full text-center">
                <h1 className="text-6xl font-extrabold text-white/98">
                  {t("about.shortName")}
                </h1>
                <span className="text-gray-100/80 text-lg break-words ">
                  {t("about.name")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
