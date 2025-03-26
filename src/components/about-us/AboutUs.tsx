import { useTranslation } from "react-i18next";
import { Container } from "../ui/container";
import GeneralInformation from "./GeneralInformation";
import Partners from "./Partners";

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="/images/about/header-chicks.jpg"
          alt="WPSA Macedonian Branch"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-end pr-12">
          <h1 className="text-5xl font-bold text-white">
            {t("about.shortName")}
          </h1>
        </div>
      </div>

      <Container className="py-12 mx-auto px-4">
        <div className="space-y-16">
          <GeneralInformation />
          <Partners />
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
