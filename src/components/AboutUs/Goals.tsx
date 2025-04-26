import { useTranslation } from "react-i18next";

const Goals = () => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-8">
      <div className="md:col-span-6">
        <h3 className="text-2xl font-bold text-primary mb-8 border-l-4 border-primary pl-4">
          {t("about.goals.title")}
        </h3>
        <p className="text-gray-700/80 leading-relaxed mb-8 text-lg">
          {t("about.goals.description")}
        </p>

        <ul className="space-y-6 border-l border-primary-200 pl-6">
          {Object.entries({
            advancement: "✓",
            congresses: "✓",
            gatherings: "✓",
            informing: "✓",
            projects: "✓",
            dissemination: "✓",
          }).map(([key, icon]) => (
            <li key={key} className="flex text-lg items-start">
              <span className="text-primary h-fit leading-6 font-bold  mr-3">
                {icon}
              </span>
              <span className="text-slate-700/80 leading-tight">
                {t(`about.goals.points.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Goals;
