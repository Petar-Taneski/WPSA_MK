import Goals from "./Goals";
import MissionVision from "./MissionVision";
import FullWidthImage from "./FullWidthImage";
import Leadership from "./Leadership";
import Membership from "./Membership";
import Partners from "./Partners";

const AboutContent = () => {
  return (
    <section className="flex flex-col gap-20">
      <Goals />
      <MissionVision />
      <FullWidthImage />
      <Leadership />
      <Membership />
      <Partners />
    </section>
  );
};

export default AboutContent;
