// import { useTranslation } from "react-i18next";

import EventCarousel from "@/components/homee/EventCarousel";
import FeaturedNews from "@/components/homee/recentNews/RecentNews";
import Hero from "@/components/homee/heroSection/Hero";
import MissionVision from "@/components/homee/MissionVision";

const Home = () => {
  // const { t } = useTranslation();

  return (
    <div>
      {/* Parallax Hero Section */}
      <Hero />
      {/* Mission Vision section */}
      <div className="flex py-16 flex-col gap-28 xl:w-4/5 lg:w-5/6 w-11/12 mx-auto justify-center items-center ">
        <div className="my-2 max-md:px-4 overflow-visible">
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
