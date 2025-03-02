
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="page about-page">
      <h1 className="text-3xl font-bold mb-4">{t("navigation.about")}</h1>
      <p>This is the about page content.</p>
    </div>
  );
};

export default About;
