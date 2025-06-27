// Post-build script to generate complete sitemap with Firebase content
import { writeFileSync } from "fs";
import { resolve } from "path";

const generateCompleteSitemap = async () => {
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
  let allUrls = [...staticPages];

  console.log("🔄 Fetching articles from Firebase for complete sitemap...");

  try {
    // Note: You'll need to set up Firebase admin for server-side access
    // This is a template - you'll need to configure Firebase admin SDK

    // For now, we'll use the client SDK approach
    // In production, you'd want to use Firebase Admin SDK for server-side

    console.log(
      "⚠️  Firebase integration for post-build sitemap needs configuration"
    );
    console.log("📄 Generating sitemap with static pages for now");
  } catch (error) {
    console.warn("❌ Could not fetch Firebase content:", error.message);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod || currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  // Write to dist directory
  const distPath = resolve("dist", "sitemap.xml");
  writeFileSync(distPath, xml);

  console.log(`✅ Complete sitemap generated: ${distPath}`);
  console.log(`📊 Total URLs: ${allUrls.length}`);
};

// Run the script
generateCompleteSitemap().catch(console.error);
