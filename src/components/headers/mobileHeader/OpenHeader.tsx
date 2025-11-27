import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navigation.css";
import { SOCIAL_MEDIA_LINKS } from "@/utils/consts";
import {
  fetchNewsArticleFromFirebase,
  getCorrespondingPost,
} from "@/services/api";

interface OpenHeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openContactModal: () => void;
}

const OpenHeader: React.FC<OpenHeaderProps> = ({
  isOpen,
  setIsOpen,
  openContactModal,
}: OpenHeaderProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: "home", label: t("navigation.home") },
    { key: "about", label: t("navigation.about") },
    { key: "news", label: t("navigation.news") },
    { key: "events", label: t("navigation.events") },
  ];

  const currentLang = location.pathname.split("/")[1] || i18n.language;

  // Function to check if a nav item is active
  const isItemActive = (itemKey: string) => {
    // Normalize the current path (decode URL-encoded characters)
    const normalizedPath = decodeURIComponent(location.pathname);

    // Get the translated path for this item
    const itemPath = t(`pages.${itemKey}`, { lng: currentLang });

    // Special case for home
    if (itemKey === "home") {
      return (
        normalizedPath === `/${currentLang}` ||
        normalizedPath === `/${currentLang}/${itemPath}`
      );
    }

    // Check for exact path match (after normalization)
    if (normalizedPath === `/${currentLang}/${itemPath}`) {
      return true;
    }

    // Check for news item detail pages
    if (itemKey === "news") {
      // For English news detail pages
      if (currentLang === "en" && normalizedPath.includes("/news/")) {
        return true;
      }

      // For Macedonian news detail pages - handle Cyrillic "вести" consistently
      if (
        currentLang === "mk" &&
        (normalizedPath.includes("/вести/") ||
          normalizedPath.includes("/%D0%B2%D0%B5%D1%81%D1%82%D0%B8/"))
      ) {
        return true;
      }
    }

    return false;
  };

  const handleLanguageChange = async () => {
    // Get the current path segments
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Toggle language
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
            setIsOpen(false);
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
      setIsOpen(false);
      return;
    }

    // Original logic for non-post pages
    i18n.changeLanguage(nextLang);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 z-[1000] bg-white/95 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div
        className={`pb-[10vh] flex flex-col h-screen pt-[93px] justify-center px-[5vw] bg-amala-purple z-[300] overflow-x-clip ${
          isOpen ? "w-screen" : "w-0"
        } h-full`}
      >
        <div className="flex flex-col space-y-5">
          {navItems.map((item) => {
            const path = `/${currentLang}/${t(`pages.${item.key}`, {
              lng: currentLang,
            })}`;
            return (
              <Link
                key={item.key}
                to={path}
                className={`flex items-center justify-between w-full gap-2 py-3 text-lg rounded-md ${
                  isItemActive(item.key)
                    ? "nav-item-active font-bold !text-primary"
                    : "nav-item font-medium text-gray-800/85"
                }`}
                style={{
                  color: isItemActive(item.key)
                    ? "var(--color-primary, #4F46E5)"
                    : "",
                  fontWeight: isItemActive(item.key) ? "700" : "500",
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            );
          })}
        </div>
        <div className="mt-5">
          <button
            onClick={() => {
              openContactModal();
              setIsOpen(false);
            }}
            className={`flex items-center justify-between w-full gap-2 py-3 text-lg font-medium rounded-md text-gray-800/85 `}
          >
            {t("navigation.contact")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="relative flex h-fit justify-center items-center mt-8">
          <div className="absolute inset-1 h-fit flex space-x-2">
            {SOCIAL_MEDIA_LINKS.map((social) => (
              <div
                key={social.name}
                className="hover:scale-110 hover:shadow-md shadow-primary hover:border-1 rounded-sm p-0.5 hover:border-primary transition-all duration-100"
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-600 hover:text-primary flex items-center justify-center w-6 h-6"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-full h-full bg-transparent"
                  />
                </a>
              </div>
            ))}
          </div>
          <div className="flex justify-end w-full">
            <button
              onClick={handleLanguageChange}
              className="flex items-center justify-center cursor-pointer p-1 z-10"
              aria-label={
                i18n.language === "en" ? t("languages.mk") : t("languages.en")
              }
            >
              <img
                src={`/images/langs/${
                  i18n.language === "mk" ? "gb.svg" : "mk.svg"
                }`}
                alt={i18n.language}
                className="w-auto h-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenHeader;
