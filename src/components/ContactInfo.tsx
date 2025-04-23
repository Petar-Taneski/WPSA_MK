import { useTranslation } from "react-i18next";

const ContactInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-8">
      <img
        src="/Logo-WPSA.png"
        alt="WPSA Logo"
        className="w-[150px] h-full mr-6 mix-blend-multiply"
      />
      <div className="xl:w-2/3 md:w-3/4">
        <h3 className="text-xl font-semibold text-primary mb-4">
          {t("about.contact.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-primary mb-2">
              {t("about.contact.address")}
            </h4>
            <p className="text-gray-700">
              {t("about.contact.addressLines.faculty")}
              <br />
              {t("about.contact.addressLines.street")}
              <br />
              {t("about.contact.addressLines.city")}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-2">
              {t("about.contact.contact")}
            </h4>
            <p className="text-gray-700 mb-1">
              {t("about.contact.email")}: info@wpsa-mk.org
            </p>
            <p className="text-gray-700">
              {t("about.contact.phone")}: +389 2 3240 700
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
