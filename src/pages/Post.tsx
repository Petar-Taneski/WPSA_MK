import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNewsArticleFromFirebase } from "../services/api";
import { NewsArticle } from "../services/interfaces";
import {
  Copy,
  Check,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PostHeader,
  PostMetadata,
  PostContent,
  PostLoading,
  PostError,
} from "../components/post";
import { DEFAULT_PLACEHOLDER_IMAGE } from "@/utils/consts";
import { useSEO } from "@/hooks/useSEO";
import { getPostSEO } from "@/config/seo";
import { parseDateString } from "@/lib/utils"; // <- added import

const Post: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [urlCopied, setUrlCopied] = useState<boolean>(false);

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    altText: string;
    index: number;
  } | null>(null);

  // Current article URL for sharing
  const articleUrl = `${window.location.origin}${window.location.pathname}`;

  // Apply dynamic SEO for the article
  useSEO(
    article
      ? getPostSEO(
          article.title,
          article.summary || article.content.substring(0, 200),
          i18n.language,
          "article",
          article.imageUrl
        )
      : {
          title:
            i18n.language === "en"
              ? "Loading Article - WPSA Macedonia"
              : "Се вчитува статија - Светско здружение за наука во живинарството Македонија",
          description:
            i18n.language === "en"
              ? "Loading article content..."
              : "Се вчитува содржината на статијата...",
          noIndex: true,
        }
  );

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleUrl).then(
      () => {
        setUrlCopied(true);
        setTimeout(() => {
          setUrlCopied(false);
        }, 3000); // Reset after 3 seconds
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Handle image click to open lightbox
  const handleImageClick = (
    photo: { url: string; altText: string },
    index: number
  ) => {
    setLightboxImage({ ...photo, index });
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Navigate to previous image
  const previousImage = () => {
    if (!lightboxImage || !article?.gallery) return;
    const galleryLength = article.gallery.length;
    const newIndex =
      lightboxImage.index > 0 ? lightboxImage.index - 1 : galleryLength - 1;
    const newPhoto = article.gallery[newIndex];
    setLightboxImage({
      url: newPhoto.url,
      altText: newPhoto.altText,
      index: newIndex,
    });
  };

  // Navigate to next image
  const nextImage = () => {
    if (!lightboxImage || !article?.gallery) return;
    const galleryLength = article.gallery.length;
    const newIndex =
      lightboxImage.index < galleryLength - 1 ? lightboxImage.index + 1 : 0;
    const newPhoto = article.gallery[newIndex];
    setLightboxImage({
      url: newPhoto.url,
      altText: newPhoto.altText,
      index: newIndex,
    });
  };

  // Get the news path based on current language
  const getNewsPath = () => {
    const currentLanguage = i18n.language;
    switch (currentLanguage) {
      case "mk":
        return "/mk/вести";
      case "en":
      default:
        return "/en/news";
    }
  };

  useEffect(() => {
    if (params.id) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          const articleData = await fetchNewsArticleFromFirebase(
            params.id as string,
            i18n.language
          );
          if (!articleData) {
            setError(t("post.notFound"));
          } else {
            setArticle(articleData);
          }
        } catch (err) {
          setError(t("post.loadError"));
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    } else {
      setError(t("post.noIdProvided"));
      setLoading(false);
    }
  }, [params.id, t, i18n.language]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;

      switch (e.key) {
        case "Escape":
          e.stopPropagation();
          closeLightbox();
          break;
        case "ArrowLeft":
          e.stopPropagation();
          previousImage();
          break;
        case "ArrowRight":
          e.stopPropagation();
          nextImage();
          break;
      }
    };

    if (lightboxImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxImage]);

  if (loading) {
    return <PostLoading />;
  }

  if (error || !article) {
    return <PostError message={error || t("post.notFound")} />;
  }

  const displayImageUrl = article.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;

  // ---------- NEW: parse + localize publishDate here (same approach as NewsCard) ----------
  const parsedPublishDate = parseDateString(article.publishDate);
  const formattedPublishDate = parsedPublishDate
    ? parsedPublishDate.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : article.publishDate;
  // --------------------------------------------------------------------------------------

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <PostHeader title={article.title} imageUrl={displayImageUrl} />
      <div className="mb-4 md:p-4 md:pb-4 md:mb-8 md:border-b md:border-gray-200">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-grow">
            <PostMetadata
              author={article.author}
              publishDate={formattedPublishDate} // <-- now passing localized string
              tags={article.tags}
            />
          </div>
          <div className="flex items-center">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center px-3 py-1.5 text-sm border border-primary-600 rounded-md hover:bg-primary-600/10 transition-colors"
              aria-label={urlCopied ? "URL copied" : "Copy article URL"}
            >
              {urlCopied ? (
                <>
                  <Check className="mr-2 w-4 h-4" />
                  {t("common.copied", "Copied!")}
                </>
              ) : (
                <>
                  <Copy className="mr-2 w-4 h-4" />
                  {t("common.copyLink", "Copy Link")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <PostContent content={article.content} />

      {/* Real gallery (when it exists) */}
      {article.gallery && article.gallery.length > 0 && (
        <div className="flex flex-col items-center px-4 my-6 mb-6 w-full">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">
            {t("post.gallery", "Gallery")}
          </h3>
          <div className="flex flex-wrap gap-2 w-full">
            {article.gallery.map((photo, index) => (
              <div
                key={index}
                className="relative cursor-pointer group/photo"
                onClick={() => handleImageClick(photo, index)}
              >
                <img
                  src={photo.url}
                  alt={photo.altText}
                  className="object-cover w-16 h-16 rounded-md transition-opacity sm:w-20 sm:h-20 hover:opacity-90"
                />
                <div className="flex absolute inset-0 justify-center items-center rounded-md opacity-0 transition-opacity bg-black/50 group-hover/photo:opacity-100">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {article.links && article.links.length > 0 && (
        <div className="px-4 mt-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            {t("post.relatedLinks", "Related Links")}
          </h3>
          <div className="space-y-2">
            {article.links.map((link, index) => (
              <div
                key={index}
                className="flex gap-3 pl-4 border-l-4 border-primary-600"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                >
                  {link.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate(getNewsPath())}
          className="px-6 py-3 font-medium text-white rounded-lg shadow-sm transition-colors bg-primary-600 hover:bg-primary-700"
        >
          {t("post.backToNews")}
        </button>
      </div>

      {/* Lightbox for full-size images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/90"
          onClick={(e) => {
            e.stopPropagation();
            closeLightbox();
          }}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.altText}
              className="object-contain max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 p-2 text-white transition-colors hover:text-gray-300"
              aria-label={t("common.close", "Close")}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {article?.gallery && article.gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                  className="absolute left-4 top-1/2 p-2 text-white transition-colors transform -translate-y-1/2 hover:text-gray-300"
                  aria-label={t("common.previous", "Previous")}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 p-2 text-white transition-colors transform -translate-y-1/2 hover:text-gray-300"
                  aria-label={t("common.next", "Next")}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 px-3 py-1 text-sm text-white rounded-md transform -translate-x-1/2 bg-black/50">
              {lightboxImage.index + 1} / {article.gallery?.length || 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
