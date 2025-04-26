import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth < 640;
  return (
    <div
      className={`overflow-hidden max-sm:-mb-[70px] min-h-[calc(100vh+70px)]`}
    >
      {/* Parallax hero section */}
      <div className={`overflow-hidden `}>
        {/* Parallax background div - full screen width */}
        <div
          className={`${isMobile ? "" : "parallax"} `}
          style={{
            backgroundImage: "url('/images/header.png')",
            backgroundSize: !isMobile ? "" : "cover",
            backgroundPosition: !isMobile ? "" : "bottom 70px right -350px",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Content overlay */}
          <div
            className={`relative flex items-center justify-center h-[calc(100vh+70px)]  text-white`}
          >
            <div className="absolute flex flex-col w-full gap-2 text-center top-1/3 ">
              <h1 className="w-4/5 mx-auto text-4xl font-extrabold leading-snug max-md:text-2xl max-md:w-11/12 text-white/90">
                {t("about.nameFirstPartNoDashes")} <br />
                {t("about.nameSecondPart")}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
