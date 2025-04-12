import { useTranslation } from "react-i18next";

const MissionVision = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary mb-12 border-l-4 border-primary pl-4">
        {t("about.mission.title")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="border-l-2 border-primary-300 pl-8">
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
            <p className="pl-6 pr-6 italic">{t("about.mission.visionContent")}</p>
            <span className="font-serif text-5xl text-primary/60 absolute -right-0 -bottom-6">
              ”
            </span>
          </div>
        </div>

        <div className="border-l-2 border-primary-300 pl-8">
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
            <p className="pl-6 pr-6 italic">{t("about.mission.missionContent")}</p>
            <span className="font-serif text-5xl text-primary/60 absolute -right-0 -bottom-6">
              ”
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
