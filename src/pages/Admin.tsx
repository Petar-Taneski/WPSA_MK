import { useTranslation } from "react-i18next";
import { useSEO } from "@/hooks/useSEO";
import { seoConfig } from "@/config/seo";
import { Dashboard } from "../components/dashboard";

const Admin = () => {
  const { i18n } = useTranslation();

  // Apply SEO
  useSEO(seoConfig.admin[i18n.language as "en" | "mk"]);

  return <Dashboard />;
};

export default Admin;
