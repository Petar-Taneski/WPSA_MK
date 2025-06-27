import { useTranslation } from "react-i18next";
import EventsContent from "@/components/events/EventsContent";
import { useSEO } from "@/hooks/useSEO";
import { seoConfig } from "@/config/seo";

const Events = () => {
  const { i18n } = useTranslation();

  // Apply SEO
  useSEO(seoConfig.events[i18n.language as "en" | "mk"]);

  return (
    <div className="page events-page">
      <EventsContent />
    </div>
  );
};

export default Events;
