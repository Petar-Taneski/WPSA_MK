import { useTranslation } from "react-i18next";
import AboutUs from "../components/aboutUs/AboutUs";
import { useSEO } from "@/hooks/useSEO";
import { seoConfig } from "@/config/seo";

const About = () => {
  const { i18n } = useTranslation();

  // Apply SEO
  useSEO(seoConfig.about[i18n.language as "en" | "mk"]);

  return (
    <div className="page about-page">
      <AboutUs />
    </div>
  );
};

export default About;
