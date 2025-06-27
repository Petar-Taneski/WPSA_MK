import type { VercelRequest, VercelResponse } from "@vercel/node";

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

// We'll use fetch to get data from your existing API endpoints or Firebase directly
const generateCompleteSitemap = async (): Promise<string> => {
  const BASE_URL = "https://wpsa.mk";

  const staticPages: SitemapURL[] = [
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
  const allUrls: SitemapURL[] = [...staticPages];

  try {
    // Import Firebase functions for serverless environment
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore, collection, getDocs, query, where, limit } =
      await import("firebase/firestore");

    // Initialize Firebase (only if not already initialized)
    if (getApps().length === 0) {
      const firebaseConfig = {
        apiKey: process.env.VITE_FIREBASE_API_KEY,
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VITE_FIREBASE_APP_ID,
      };
      initializeApp(firebaseConfig);
    }

    const db = getFirestore();

    // Fetch English news
    const englishNewsQuery = query(
      collection(db, "news"),
      where("lang", "==", "english"),
      limit(1000)
    );
    const englishNewsSnapshot = await getDocs(englishNewsQuery);

    // Fetch Macedonian news
    const macedonianNewsQuery = query(
      collection(db, "news"),
      where("lang", "==", "macedonian"),
      limit(1000)
    );
    const macedonianNewsSnapshot = await getDocs(macedonianNewsQuery);

    // Add English news URLs
    englishNewsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      allUrls.push({
        loc: `/en/news/${doc.id}`,
        lastmod:
          data.publishDate?.toDate?.()?.toISOString().split("T")[0] ||
          currentDate,
        changefreq: "monthly",
        priority: 0.7,
      });
    });

    // Add Macedonian news URLs
    macedonianNewsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      allUrls.push({
        loc: `/mk/вести/${doc.id}`,
        lastmod:
          data.publishDate?.toDate?.()?.toISOString().split("T")[0] ||
          currentDate,
        changefreq: "monthly",
        priority: 0.7,
      });
    });

    console.log(
      `✅ Added ${
        englishNewsSnapshot.size + macedonianNewsSnapshot.size
      } articles to sitemap`
    );
  } catch (error) {
    console.error("❌ Error fetching Firebase data:", error);
    // Continue with static pages only
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

  return xml;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sitemap = await generateCompleteSitemap();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"); // Cache for 1 hour
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
}
