import { useTranslation } from "react-i18next";

const MissionVision = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="mb-4 text-3xl text-center w-full pb- font-bold md:text-4xl text-primary/85">
        {t("about.mission.title")}
      </h2>

      <div className="flex h-full justify-between max-w-6xl max-md:gap-14 max-md:flex-col">
        <div className="md:w-[45%]">
          <h4 className="text-xl font-bold text-primary mb-4">
            {t("about.mission.missionLabel")}
          </h4>
          <p className="text-gray-700/80 leading-snug text-lg mb-6">
            {t("about.mission.missionDeclaration")}
          </p>
          <div className="text-gray-700/80 leading-tight text-lg relative">
            <span className="font-serif text-5xl text-primary/60 absolute -left-2 -top-3">
              “
            </span>
            <p className="px-6 italic">{t("about.mission.missionContent")}</p>
            <span className="font-serif text-5xl text-primary/60 absolute -right-0 -bottom-10">
              ”
            </span>
          </div>
        </div>

        <div className="w-[3px] h-100% rounded-full bg-primary/80 max-md:hidden" />

        <div className="md:w-[45%]">
          <h4 className="text-xl font-bold text-primary mb-4">
            {t("about.mission.visionLabel")}
          </h4>
          <p className="text-gray-700/80 leading-snug text-lg mb-6">
            {t("about.mission.visionDeclaration")}
          </p>
          <div className="text-gray-700/80 leading-tight text-lg relative">
            <span className="font-serif text-5xl text-primary/60 absolute -left-2 -top-3">
              “
            </span>
            <p className="pl-6 pr-6 italic">
              {t("about.mission.visionContent")}
            </p>
            <span className="font-serif text-5xl text-primary/60 absolute -right-0 -bottom-10">
              ”
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
