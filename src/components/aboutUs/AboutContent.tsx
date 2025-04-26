import FullWidthImage from "./FullWidthImage";
import Goals from "./Goals";
import Leadership from "./Leadership";
import Membership from "./Membership";
import Partners from "./Partners";

const AboutContent = () => {
  return (
    <section className="flex flex-col gap-20">
      <Goals />
      <FullWidthImage />
      <Leadership />
      <Membership />
      <Partners />
    </section>
  );
};

export default AboutContent;
