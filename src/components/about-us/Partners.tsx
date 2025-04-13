import { useTranslation } from "react-i18next";
import { PARTNERS } from "@/utils/consts";

const Partners = () => {
  const { t } = useTranslation();

  return (
    <section className="partners">
      <h2 className="text-3xl font-bold text-primary mb-8 border-b pb-4">
        {t("about.partners.title")}
      </h2>

      <p className="text-gray-700/80 mb-8">{t("about.partners.description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* TODO: Add logo to the partner */}
        {PARTNERS.map((partner) => (
          <PartnerLink
            key={partner.name}
            name={t(partner.name)}
            description={t(partner.description)}
            url={partner.url}
          />
        ))}
      </div>

      <div className="mb-12 bg-gray-50 p-8 rounded-lg border border-gray-100">
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
    </section>
  );
};

interface PartnerLinkProps {
  name: string;
  description: string;
  url: string;
}

const PartnerLink = ({ name, description, url }: PartnerLinkProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center shrink-0">
        <span className="text-3xl">🏢</span>
        {/* Use the line below instead of the emoji when you have actual logos */}
        {/* <img src={logo} alt={name} className="max-w-full max-h-full p-2" /> */}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-medium text-primary-600">{name}</h3>
        <p className="text-sm text-gray-600/80 mt-1">{description}</p>
      </div>
    </a>
  );
};

export default Partners;
