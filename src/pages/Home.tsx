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

      {/* Event carousel section */}
      <EventCarousel />

      {/* Recent news section */}
      <FeaturedNews />
    </div>
  );
};

export default Home;
