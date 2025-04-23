// import { useTranslation } from "react-i18next";

import EventCarousel from "@/components/Home/EventCarousel";
import FeaturedNews from "@/components/Home/RecentNews/RecentNews";
import Hero from "@/components/Home/HeroSection/Hero";
import MissionVision from "@/components/AboutUs/MissionVision";

const Home = () => {
  // const { t } = useTranslation();

  return (
    <div>
      {/* Parallax Hero Section */}
      <Hero />
      {/* Mission Vision section */}
      <div className="flex py-16 flex-col gap-28 w-4/5 mx-auto justify-center items-center ">
        <div className="my-2 overflow-visible">
          <MissionVision />
        </div>

        {/* Event carousel section */}
        <EventCarousel />

        {/* Recent news section */}
        <FeaturedNews />
      </div>
    </div>
  );
};

export default Home;
