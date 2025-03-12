import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchNewsArticle, NewsArticle } from "../services/api";

// Import modular components
import LoadingState from "./news/LoadingState";
import ErrorState from "./news/ErrorState";
import ArticleHeader from "./news/ArticleHeader";
import ArticleContent from "./news/ArticleContent";
import ShareButtons from "./news/ShareButtons";

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticle = async () => {
      if (!id) {
        setError("No article ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchNewsArticle(id);
        if (result) {
          setArticle(result);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  if (loading) {
    return <LoadingState message={t("news.loadingArticle")} />;
  }

  if (error || !article) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/news"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-8 group"
      >
        <svg
          className="mr-2 w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        {t("news.backToAllNews")}
      </Link>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Article Header */}
        <ArticleHeader article={article} />

        {/* Article Content */}
        <div className="p-6 sm:p-10">
          <ArticleContent content={article.content} />

          {/* Share and navigation section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
              {/* Share buttons */}
              <ShareButtons />

              {/* Navigation button */}
              <Link
                to="/news"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  ></path>
                </svg>
                {t("news.backToNews")}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetails;
