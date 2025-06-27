import { useTranslation } from "react-i18next";
import NewsContent from "../components/news/NewsContent";
import { useSEO } from "@/hooks/useSEO";
import { seoConfig } from "@/config/seo";

const News = () => {
  const { i18n } = useTranslation();

  // Apply SEO
  useSEO(seoConfig.news[i18n.language as "en" | "mk"]);

  return <NewsContent />;
};

export default News;
