import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNewsArticleFromFirebase } from "../services/api";
import { NewsArticle } from "../services/interfaces";
import { Copy, Check } from "lucide-react";
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

const Post: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [urlCopied, setUrlCopied] = useState<boolean>(false);

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <PostLoading />;
  }

  if (error || !article) {
    return <PostError message={error || t("post.notFound")} />;
  }

  const displayImageUrl = article.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;
  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <PostHeader title={article.title} imageUrl={displayImageUrl} />
      <div className="mb-4 md:p-4 md:pb-4 md:mb-8 md:border-b md:border-gray-200">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-grow">
            <PostMetadata
              author={article.author}
              publishDate={article.publishDate}
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
    </div>
  );
};

export default Post;
