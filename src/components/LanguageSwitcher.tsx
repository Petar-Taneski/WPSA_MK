import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchNewsArticleFromFirebase,
  getCorrespondingPost,
} from "@/services/api";

// Define types for the page key mapping
interface PageKeyMap {
  [key: string]: string;
}

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = async () => {
    // Get the current path segments
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Determine the next language (toggle between 'en' and 'mk')
    const nextLang = i18n.language === "en" ? "mk" : "en";

    // Check if we're on a post page and handle corresponding post navigation
    // Handle both raw and URL-encoded Cyrillic characters
    const normalizedPath = decodeURIComponent(location.pathname);
    const isPostPage =
      pathSegments.length === 3 &&
      ((pathSegments[0] === "en" && pathSegments[1] === "news") ||
        (pathSegments[0] === "mk" &&
          (pathSegments[1] === "вести" ||
            pathSegments[1] === "%D0%B2%D0%B5%D1%81%D1%82%D0%B8" ||
            normalizedPath.includes("/вести/"))));

    if (isPostPage) {
      const postId = pathSegments[2];

      try {
        // Get the current post to check if it has a correspondingId
        const currentPost = await fetchNewsArticleFromFirebase(
          postId,
          i18n.language
        );

        if (currentPost && currentPost.correspondingId) {
          // Verify the corresponding post exists and is in the opposite language
          const expectedLang = nextLang === "en" ? "english" : "macedonian";

          const correspondingPost = await getCorrespondingPost(
            currentPost.correspondingId,
            expectedLang
          );

          if (correspondingPost) {
            // Change language first
            i18n.changeLanguage(nextLang);

            // Navigate to the corresponding post
            const newPath =
              nextLang === "en"
                ? `/en/news/${correspondingPost.id}`
                : `/mk/вести/${correspondingPost.id}`;

            navigate(newPath);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching corresponding post:", error);
      }

      // Fallback: redirect to news page using translation system
      // First change the language
      await i18n.changeLanguage(nextLang);

      // Wait a tick for the language change to propagate, then build the path
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Use the same translation approach as App.tsx
      const newsTranslation = t("pages.news", { lng: nextLang });
      const newsPath = `/${nextLang}/${newsTranslation}`;

      navigate(newsPath);
      return;
    }

    // Original logic for non-post pages
    // Get the route key by matching the current URL segment to a known route
    const currentLang = pathSegments[0]; // 'en' or 'mk'
    // URL decode the current page slug to handle encoded characters like spaces
    const currentPageSlug = pathSegments[1]
      ? decodeURIComponent(pathSegments[1])
      : "home";

    // Map of Macedonian page slugs to their page keys
    const mkPageKeyMap: PageKeyMap = {
      почетна: "home",
      "за нас": "about",
      вести: "news",
      настани: "events",
      // Add other page mappings as needed
    };

    // Reverse mapping for direct slug lookup (for handling encoding differences)
    const pageKeysToCheck = ["home", "about", "news", "events"];

    // Get the correct page key based on the current language and slug
    let pageKey = currentPageSlug;

    if (currentLang === "mk") {
      // First try direct mapping
      if (mkPageKeyMap[currentPageSlug]) {
        pageKey = mkPageKeyMap[currentPageSlug];
      } else {
        // Fallback: try to match by comparing with translated values
        for (const key of pageKeysToCheck) {
          const translatedValue = t(`pages.${key}`, { lng: "mk" });
          if (currentPageSlug === translatedValue) {
            pageKey = key;
            break;
          }
        }
      }
    }

    // Change the language first
    i18n.changeLanguage(nextLang);

    // Get translated page name for the next language using the correct key
    const translatedPage = t(`pages.${pageKey}`);

    // Build new path with new language
    const newPath = `/${nextLang}/${translatedPage}`;

    // Navigate to translated route
    navigate(newPath);
  };

  // Determine flag image based on current language
  const flagImage = i18n.language === "mk" ? "gb.svg" : "mk.svg";

  return (
    <div className="language-switcher">
      <button
        onClick={changeLanguage}
        className="flex items-center justify-center p-2 cursor-pointer"
        aria-label={t("switchTo", {
          lang: i18n.language === "en" ? t("languages.mk") : t("languages.en"),
        })}
      >
        <img
          src={`/images/langs/${flagImage}`}
          alt={i18n.language}
          className="w-auto h-5"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
