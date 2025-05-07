import { useTranslation } from "react-i18next";
import { SOCIAL_MEDIA_LINKS } from "@/utils/consts";

const ContactInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between py-6 px-[5vw] relative">
      <div className="absolute top-6 right-[5vw] flex space-x-2">
        {SOCIAL_MEDIA_LINKS.map((social) => (
          <div
            key={social.name}
            className="hover:scale-102 hover:shadow-sm shadow-primary hover:border-1 rounded-sm p-0.5 hover:border-primary transition-all duration-100"
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="text-gray-600 hover:text-primary flex items-center justify-center w-6 h-6"
            >
              <img
                src={social.icon}
                alt={social.name}
                className="w-full h-full bg-transparent"
              />
            </a>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <img
          src="/Logo-WPSA.png"
          alt="WPSA Logo"
          className="w-[120px] h-auto mix-blend-multiply"
        />
      </div>

      <div className="flex flex-col w-full text-center md:flex-row md:text-left md:w-auto">
        <div className="w-3/4 mb-4 md:mb-0 md:mr-8">
          <h4 className="mb-1 font-bold text-primary">
            {t("about.contact.address")}
          </h4>
          <p className="pb-1 text-sm leading-tight text-gray-600 whitespace-normal">
            {t("about.nameFirstPart")}
            <br />
            {t("about.nameSecondPart")}
          </p>
          <p className="text-sm text-gray-600 whitespace-normal">
            {t("about.contact.addressLines.street")}
            <br />
            {t("about.contact.addressLines.city")}
          </p>
        </div>

        <div className="pr-10">
          <h4 className="mb-1 font-bold h-8 text-primary">
            {t("about.contact.contact")}
          </h4>
          <p className="mb-1 text-sm text-gray-600">
            {t("about.contact.email")}: zivinarskozdruzenie@gmail.com
          </p>
          <p className="text-sm text-gray-600">
            {t("about.contact.phone")}: +389 75 267 026
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
