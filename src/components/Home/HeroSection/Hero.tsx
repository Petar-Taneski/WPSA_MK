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
          <div className="flex items-center justify-center h-full min-h-screen text-white">
            <div className="container px-4 mx-auto">
              <div className="flex flex-col w-full gap-2 text-center md:pr-10 pb-30">
                <h1 className="text-4xl font-extrabold leading-normal text-white/90">
                  {t("about.nameWithoutDashes")}
                </h1>
                <span className="text-lg break-words text-gray-100/80 "></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
