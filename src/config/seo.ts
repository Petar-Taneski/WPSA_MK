import { SEOProps } from "../hooks/useSEO";

export interface SEOConfig {
  [key: string]: {
    en: SEOProps;
    mk: SEOProps;
  };
}

export const seoConfig: SEOConfig = {
  home: {
    en: {
      title:
        "WPSA Macedonia - World Poultry Science Association Macedonian Branch",
      description:
        "WPSA Macedonia promotes advancement of knowledge in poultry science and industry through scientific meetings, research, and international collaboration. Join our association dedicated to poultry science.",
      keywords:
        "WPSA, World Poultry Science Association, Macedonia, poultry science, poultry industry, veterinary medicine, poultry research, Macedonia poultry, livestock, agriculture",
      type: "website",
    },
    mk: {
      title: "Светско здружение за наука во живинарството Македонски огранок",
      description:
        "Светско здружение за наука во живинарството Македонија промовира напредок на знаењето во науката за живинарството и индустријата преку научни собири, истражувања и меѓународна соработка. Придружете се на нашето здружение посветено на науката за живинарството.",
      keywords:
        "Светско здружение за наука во живинарството, Македонија, наука за живинарството, живинарска индустрија, ветеринарна медицина, истражување на живинарството, македонско живинарство, сточарство, земјоделство",
      type: "website",
    },
  },
  about: {
    en: {
      title: "About WPSA Macedonia - Leadership, Mission & Goals",
      description:
        "Learn about WPSA Macedonia's mission, vision, leadership team, and goals in advancing poultry science. Meet our executive board and discover our commitment to sustainable poultry development.",
      keywords:
        "WPSA Macedonia about, poultry science leadership, Macedonia veterinary association, poultry research goals, sustainable poultry development, executive board",
      type: "website",
    },
    mk: {
      title:
        "За Светско здружение за наука во живинарството Македонија - Раководство, Мисија и Цели",
      description:
        "Дознајте за мисијата, визијата, раководниот тим и целите на Светско здружение за наука во живинарството Македонија во унапредувањето на науката за живинарството. Запознајте се со нашиот извршен одбор и откријте ја нашата посветеност на одржлив развој на живинарството.",
      keywords:
        "Светско здружение за наука во живинарството Македонија за нас, раководство наука живинарство, македонско ветеринарно здружение, цели истражување живинарство, одржлив развој живинарство, извршен одбор",
      type: "website",
    },
  },
  news: {
    en: {
      title: "Latest News - WPSA Macedonia Updates & Announcements",
      description:
        "Stay updated with the latest news, announcements, and developments from WPSA Macedonia. Read about poultry science research, industry updates, and association activities.",
      keywords:
        "WPSA Macedonia news, poultry science news, veterinary news Macedonia, poultry industry updates, association announcements, research developments",
      type: "website",
    },
    mk: {
      title:
        "Најнови вести - Светско здружение за наука во живинарството Македонија новости и објави",
      description:
        "Бидете во тек со најновите вести, објави и случувања од Светско здружение за наука во живинарството Македонија. Читајте за истражувања во науката за живинарството, новости од индустријата и активности на здружението.",
      keywords:
        "Светско здружение за наука во живинарството Македонија вести, вести наука живинарство, ветеринарни вести Македонија, новости живинарска индустрија, објави здружение, развој истражувања",
      type: "website",
    },
  },
  events: {
    en: {
      title: "Events & Workshops - WPSA Macedonia Scientific Meetings",
      description:
        "Discover upcoming and past events, workshops, and scientific meetings organized by WPSA Macedonia. Join our educational activities and professional gatherings in poultry science.",
      keywords:
        "WPSA Macedonia events, poultry science workshops, scientific meetings Macedonia, veterinary conferences, poultry education, professional development",
      type: "website",
    },
    mk: {
      title:
        "Настани и работилници - Светско здружение за наука во живинарството Македонија научни собири",
      description:
        "Откријте ги претстојните и минатите настани, работилници и научни собири организирани од Светско здружение за наука во живинарството Македонија. Придружете се на нашите едукативни активности и професионални собири во науката за живинарството.",
      keywords:
        "Светско здружение за наука во живинарството Македонија настани, работилници наука живинарство, научни собири Македонија, ветеринарни конференции, образование живинарство, професионален развој",
      type: "website",
    },
  },
  login: {
    en: {
      title: "Admin Login - WPSA Macedonia",
      description: "Admin login portal for WPSA Macedonia content management.",
      keywords: "WPSA Macedonia admin, login, content management",
      type: "website",
      noIndex: true,
    },
    mk: {
      title:
        "Најава администратор - Светско здружение за наука во живинарството Македонија",
      description:
        "Портал за најава на администраторот за управување со содржини на Светско здружение за наука во живинарството Македонија.",
      keywords:
        "Светско здружение за наука во живинарството Македонија админ, најава, управување содржини",
      type: "website",
      noIndex: true,
    },
  },
  admin: {
    en: {
      title: "Administration Panel - WPSA Macedonia",
      description: "Administration panel for managing WPSA Macedonia content.",
      keywords:
        "WPSA Macedonia administration, content management, admin panel",
      type: "website",
      noIndex: true,
    },
    mk: {
      title:
        "Администрациски панел - Светско здружение за наука во живинарството Македонија",
      description:
        "Администрациски панел за управување со содржини на Светско здружение за наука во живинарството Македонија.",
      keywords:
        "Светско здружение за наука во живинарството Македонија администрација, управување содржини, админ панел",
      type: "website",
      noIndex: true,
    },
  },
};

// Function to get SEO data for dynamic pages (news posts, events)
export const getPostSEO = (
  title: string,
  description: string,
  lang: string,
  type: "article" | "events" = "article",
  image?: string
): SEOProps => {
  const baseTitle =
    lang === "en"
      ? "WPSA Macedonia"
      : "Светско здружение за наука во живинарството Македонија";
  const typeText =
    type === "article"
      ? lang === "en"
        ? "News"
        : "Вести"
      : lang === "en"
      ? "Events"
      : "Настани";

  return {
    title: `${title} - ${typeText} | ${baseTitle}`,
    description:
      description.length > 160
        ? `${description.substring(0, 157)}...`
        : description,
    keywords:
      type === "article"
        ? `${
            lang === "en"
              ? "WPSA Macedonia news, poultry science, veterinary news"
              : "Светско здружение за наука во живинарството Македонија вести, наука живинарство, ветеринарни вести"
          }`
        : `${
            lang === "en"
              ? "WPSA Macedonia events, poultry workshops, scientific meetings"
              : "Светско здружение за наука во живинарството Македонија настани, работилници живинарство, научни собири"
          }`,
    type: type === "article" ? "article" : "website",
    image,
  };
};
