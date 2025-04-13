import { useTranslation } from "react-i18next";

const Membership = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-2xl font-bold text-primary mb-8 border-l-4 border-primary pl-4">
        {t("about.membership.title")}
      </h3>
      <p className="text-gray-700/80 leading-relaxed mb-12 max-w-4xl">
        {t("about.membership.description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
        {Object.entries({
          regular: {
            icon: "👤",
            color: "border-primary-300",
          },
          student: {
            icon: "🎓",
            color: "border-primary-300",
          },
          honorary: {
            icon: "🏆",
            color: "border-primary-300",
          },
          associate: {
            icon: "🏢",
            color: "border-primary-300",
          },
        }).map(([key, { icon, color }]) => (
          <div key={key} className={`p-8 border-l-3 ${color}`}>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{icon}</span>
              <h4 className="text-xl font-bold text-primary">
                {t(`about.membership.types.${key}.title`)}
              </h4>
            </div>
            <p className="text-gray-700/80">
              {t(`about.membership.types.${key}.description`)}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-primary-700 mb-4">
          {t("about.join.title")}
        </h3>
        <div className="border-l-4 border-gray-200 pl-6 py-4 text-gray-700">
          <p className="text-gray-700/80 mb-4">{t("about.join.description")}</p>

          <div className=" py-4 text-gray-700/80">
            {t("about.membership.fee")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
