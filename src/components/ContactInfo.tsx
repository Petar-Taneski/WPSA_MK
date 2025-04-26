import { useTranslation } from "react-i18next";

const ContactInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between py-6 px-[5vw]">
      {/* Logo Section */}
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <img
          src="/Logo-WPSA.png"
          alt="WPSA Logo"
          className="w-[120px] h-auto mix-blend-multiply"
        />
      </div>

      {/* Contact Details Section */}
      <div className="flex flex-col w-full text-center md:flex-row md:text-left md:w-auto">
        {/* Address */}
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

        {/* Contact Info */}
        <div>
          <h4 className="mb-1 font-bold text-primary">
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
