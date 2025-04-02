// import { useTranslation } from "react-i18next";

import EventCarousel from "@/components/Home/EventCarousel";
import FeaturedNews from "@/components/Home/RecentNews/RecentNews";
import Hero from "@/components/Home/HeroSection/Hero";

const Home = () => {
  // const { t } = useTranslation();

  return (
    <div>
      {/* Parallax Hero Section */}
      <Hero />

      {/* Unified gradient background wrapper */}
      <div className="bg-gradient-to-b from-white via-slate-500 to-slate-900">
        <EventCarousel />
        <FeaturedNews />
      </div>
    </div>
  );
};

export default Home;
