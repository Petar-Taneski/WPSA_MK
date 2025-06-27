import { Plugin } from "vite";

// Generate sitemap with static pages only - Firebase imports cause build issues
const generateStaticSitemap = (): string => {
  const BASE_URL = "https://wpsa.mk";

  const staticPages = [
    { loc: "/en/home", changefreq: "weekly", priority: 1.0 },
    { loc: "/mk/почетна", changefreq: "weekly", priority: 1.0 },
    { loc: "/en/about", changefreq: "monthly", priority: 0.8 },
    { loc: "/mk/за нас", changefreq: "monthly", priority: 0.8 },
    { loc: "/en/news", changefreq: "daily", priority: 0.9 },
    { loc: "/mk/вести", changefreq: "daily", priority: 0.9 },
    { loc: "/en/events", changefreq: "weekly", priority: 0.9 },
    { loc: "/mk/настани", changefreq: "weekly", priority: 0.9 },
  ];

  const currentDate = new Date().toISOString().split("T")[0];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
};

export function sitemapPlugin(): Plugin {
  return {
    name: "vite-sitemap-plugin",
    generateBundle() {
      console.log("🗺️  Generating sitemap...");

      // Generate basic sitemap with static pages
      const sitemapContent = generateStaticSitemap();

      // Write the sitemap to the output directory
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: sitemapContent,
      });

      console.log("✅ Basic sitemap.xml generated with static pages");
      console.log(
        "ℹ️  For complete sitemap with all articles, use the Admin Panel → SEO Management"
      );
    },
  };
}
