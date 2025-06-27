import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

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
  const BASE_URL = "https://wpsa-mk.com";

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

  // Check if Firebase environment variables are available
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  const hasFirebaseConfig = Object.values(firebaseConfig).every(
    (value) => value && value.trim() !== ""
  );

  console.log("🔍 Firebase Config Check:", {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    hasStorageBucket: !!firebaseConfig.storageBucket,
    hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
    hasAppId: !!firebaseConfig.appId,
    allConfigPresent: hasFirebaseConfig,
  });

  if (!hasFirebaseConfig) {
    console.warn(
      "⚠️ Firebase environment variables missing. Using static sitemap only."
    );
    console.warn(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("FIREBASE"))
    );
  } else {
    try {
      console.log("🔥 Initializing Firebase...");

      // Initialize Firebase (only if not already initialized)
      if (getApps().length === 0) {
        console.log("🔥 Creating new Firebase app...");
        initializeApp(firebaseConfig);
      } else {
        console.log("🔥 Using existing Firebase app...");
      }

      const db = getFirestore();
      console.log("📊 Firestore initialized, fetching data...");

      // Fetch English news
      const englishNewsQuery = query(
        collection(db, "news"),
        where("lang", "==", "english"),
        limit(1000)
      );
      const englishNewsSnapshot = await getDocs(englishNewsQuery);
      console.log(`📰 Found ${englishNewsSnapshot.size} English articles`);

      // Fetch Macedonian news
      const macedonianNewsQuery = query(
        collection(db, "news"),
        where("lang", "==", "macedonian"),
        limit(1000)
      );
      const macedonianNewsSnapshot = await getDocs(macedonianNewsQuery);
      console.log(
        `📰 Found ${macedonianNewsSnapshot.size} Macedonian articles`
      );

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
        `✅ Successfully added ${
          englishNewsSnapshot.size + macedonianNewsSnapshot.size
        } articles to sitemap`
      );
    } catch (error) {
      console.error("❌ Error fetching Firebase data:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      // Continue with static pages only - don't crash
    }
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

  console.log(`📄 Generated sitemap with ${allUrls.length} URLs`);
  return xml;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("🚀 Sitemap generation started");
    const sitemap = await generateCompleteSitemap();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"); // Cache for 1 hour
    res.status(200).send(sitemap);
    console.log("✅ Sitemap sent successfully");
  } catch (error) {
    console.error("💥 Sitemap generation error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a basic sitemap even if there's an error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://wpsa-mk.com/en/home</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://wpsa-mk.com/mk/почетна</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(basicSitemap);
  }
}
