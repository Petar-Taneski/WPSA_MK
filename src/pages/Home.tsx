import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="page home-page">
      <h1 className="text-3xl font-bold mb-4">{t("navigation.home")}</h1>
      <p>This is the home page content.</p>
    </div>
  );
};

export default Home;
