import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
  canonical?: string;
}

export const useSEO = (seoData: SEOProps) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentUrl = `${window.location.origin}${location.pathname}`;
    const defaultImage = `${window.location.origin}/Logo-WPSA.png`;

    // Set document title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Helper function to set or update meta tags
    const setMetaTag = (
      property: string,
      content: string,
      isProperty = false
    ) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // Set basic meta tags
    if (seoData.description) {
      setMetaTag("description", seoData.description);
    }

    if (seoData.keywords) {
      setMetaTag("keywords", seoData.keywords);
    }

    // Set language
    document.documentElement.lang = i18n.language;

    // Set robots meta tag
    if (seoData.noIndex) {
      setMetaTag("robots", "noindex, nofollow");
    } else {
      setMetaTag("robots", "index, follow");
    }

    // Set canonical URL
    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = seoData.canonical || currentUrl;

    // Set Open Graph meta tags
    setMetaTag("og:title", seoData.title || document.title, true);
    setMetaTag("og:description", seoData.description || "", true);
    setMetaTag("og:url", seoData.url || currentUrl, true);
    setMetaTag("og:type", seoData.type || "website", true);
    setMetaTag("og:image", seoData.image || defaultImage, true);
    setMetaTag("og:site_name", "WPSA Macedonia", true);
    setMetaTag("og:locale", i18n.language === "mk" ? "mk_MK" : "en_US", true);

    // Set Twitter Card meta tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", seoData.title || document.title);
    setMetaTag("twitter:description", seoData.description || "");
    setMetaTag("twitter:image", seoData.image || defaultImage);

    // Set alternate language links
    const alternateLinks = document.querySelectorAll(
      'link[rel="alternate"][hreflang]'
    );
    alternateLinks.forEach((link) => link.remove());

    const currentPath = location.pathname.replace(/^\/(en|mk)/, "");
    const enPath = `/en${currentPath}`;
    const mkPath = `/mk${currentPath}`;

    // Add alternate language links
    const createAlternateLink = (hreflang: string, href: string) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hreflang;
      link.href = `${window.location.origin}${href}`;
      document.head.appendChild(link);
    };

    createAlternateLink("en", enPath);
    createAlternateLink("mk", mkPath);
    createAlternateLink("x-default", enPath);
  }, [seoData, location.pathname, i18n.language]);
};
