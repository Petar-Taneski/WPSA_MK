import { useTranslation } from "react-i18next";

const Partners = () => {
  const { t } = useTranslation();

  // Example partner data
  const partners = [
    {
      name: "World's Poultry Science Association",
      logo: "/images/partner-1.png",
      description:
        "International organization dedicated to advancing poultry science globally.",
      url: "https://www.wpsa.com/index.php/branches/wpsa-branches/branch-secretaries-glossary/macedonia",
    },
    {
      name: "European Federation of WPSA Branches",
      logo: "/images/partner-2.png",
      description: "Coordinating body for European WPSA branches.",
      url: "https://www.wpsa.com/index.php/federations/european-federation",
    },
    {
      name: "WPSA_EF_EC_2024_Agenda_new",
      logo: "/images/partner-3.png",
      description:
        "European Federation of WPSA Branches executive committee agenda document.",
      url: "#",
    },
    {
      name: "Mediterranean Poultry Network",
      logo: "/images/partner-4.png",
      description:
        "Network connecting poultry science professionals across the Mediterranean region.",
      url: "#",
    },
  ];

  return (
    <section className="partners">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        {t("about.partners.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {partners.map((partner, index) => (
          <PartnerLink key={index} partner={partner} />
        ))}
      </div>

      <div className="mb-12 bg-gray-50 p-8 rounded-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {t("about.contact.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">
              {t("about.contact.address")}
            </h4>
            <p className="text-gray-700">
              {t(
                "about.contact.addressLines.faculty",
                "Faculty of Veterinary Medicine"
              )}
              <br />
              {t("about.contact.addressLines.street", "Lazar Pop Trajkov 5-7")}
              <br />
              {t(
                "about.contact.addressLines.city",
                "1000 Skopje, North Macedonia"
              )}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-2">
              {t("about.contact.contact")}
            </h4>
            <p className="text-gray-700 mb-1">
              {t("about.contact.email", "Email")}: info@wpsa-mk.org
            </p>
            <p className="text-gray-700">
              {t("about.contact.phone", "Phone")}: +389 2 3240 700
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {t("about.join.title")}
        </h3>

        <p className="text-gray-700 mb-4">{t("about.join.description")}</p>
      </div>
    </section>
  );
};

interface PartnerProps {
  partner: {
    name: string;
    logo: string;
    description: string;
    url: string;
  };
}

const PartnerLink = ({ partner }: PartnerProps) => {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center shrink-0">
        <span className="text-3xl">🏢</span>
        {/* Use the line below instead of the emoji when you have actual logos */}
        {/* <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full p-2" /> */}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-medium text-indigo-600">{partner.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{partner.description}</p>
      </div>
    </a>
  );
};

export default Partners;
