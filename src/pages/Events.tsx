import { useTranslation } from "react-i18next";

const Events = () => {
  const { t } = useTranslation();

  return (
    <div className="page events-page">
      <h1 className="text-3xl font-bold mb-4">{t("navigation.events")}</h1>
      <p>This is the events page content.</p>
    </div>
  );
};

export default Events;
