import { NewsArticle } from "../services/interfaces";
import { fetchNewsArticlesFromFirebase } from "../services/api";

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

// Base URL for the site
const BASE_URL = "https://wpsa.mk";

// Static pages configuration
const staticPages: SitemapURL[] = [
  {
    loc: "/en/home",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    loc: "/mk/почетна",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    loc: "/en/about",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    loc: "/mk/за нас",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    loc: "/en/news",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    loc: "/mk/вести",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    loc: "/en/events",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    loc: "/mk/настани",
    changefreq: "weekly",
    priority: 0.9,
  },
];

// Helper function to format date for sitemap
const formatSitemapDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
};

// Function to fetch dynamic news URLs (only news has individual pages)
const fetchNewsUrls = async (): Promise<SitemapURL[]> => {
  const urls: SitemapURL[] = [];

  try {
    // Fetch English news
    const englishNews = await fetchNewsArticlesFromFirebase({
      lang: "en",
      fetchLimit: 1000, // Get all articles
    });

    // Fetch Macedonian news
    const macedonianNews = await fetchNewsArticlesFromFirebase({
      lang: "mk",
      fetchLimit: 1000, // Get all articles
    });

    // Add English news URLs
    englishNews.forEach((article: NewsArticle) => {
      urls.push({
        loc: `/en/news/${article.id}`,
        lastmod: formatSitemapDate(article.publishDate),
        changefreq: "monthly",
        priority: 0.7,
      });
    });

    // Add Macedonian news URLs
    macedonianNews.forEach((article: NewsArticle) => {
      urls.push({
        loc: `/mk/вести/${article.id}`,
        lastmod: formatSitemapDate(article.publishDate),
        changefreq: "monthly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Error fetching news for sitemap:", error);
  }

  return urls;
};

// Main function to generate sitemap XML
export const generateSitemap = async (): Promise<string> => {
  const allUrls: SitemapURL[] = [...staticPages];

  // Fetch dynamic content URLs (only news articles, events don't have individual pages)
  const newsUrls = await fetchNewsUrls();
  allUrls.push(...newsUrls);

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
};

// Function to download sitemap as file (for development/testing)
export const downloadSitemap = async (): Promise<void> => {
  const sitemapXml = await generateSitemap();
  const blob = new Blob([sitemapXml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
