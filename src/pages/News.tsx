import { useTranslation } from "react-i18next";

const News = () => {
  const { t } = useTranslation();

  return (
    <div className="page news-page">
      <h1 className="text-3xl font-bold mb-4">{t("navigation.news")}</h1>
      <p>This is the news page content.</p>
    </div>
  );
};

export default News;
