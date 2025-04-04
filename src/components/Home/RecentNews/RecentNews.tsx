import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NewsArticle, fetchNewsArticles } from "../../../services/api";
import NewsItem from "./NewsItem";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RecentNews = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  // Get the current language
  const currentLanguage = i18n.language;

  // Get the correct news path based on current language
  const getNewsPath = () => {
    switch (currentLanguage) {
      case "mk":
        return "/mk/вести";
      case "en":
      default:
        return "/en/news";
    }
  };

  // Fetch articles from API
  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedArticles = await fetchNewsArticles();

        // Sort articles by publishDate (newest first)
        const sortedArticles = [...fetchedArticles].sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );

        // Take only the 3 most recent articles
        setArticles(sortedArticles.slice(0, 3));
      } catch (err) {
        console.error("Error loading articles:", err);
        setError(t("news.errorLoading"));
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [currentLanguage, t]); // Re-fetch when language changes

  if (loading) {
    return (
      <div className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            {t("news.recentTitle")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("news.recentDescription")}
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            {/* Equal height card layout */}
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 md:gap-16 lg:gap-24">
                {articles.map((article, index) => (
                  <div
                    key={article.id}
                    className="flex flex-col w-full md:w-64 lg:w-72"
                  >
                    <div className="h-full">
                      <NewsItem article={article} index={index} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to={getNewsPath()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                aria-label={t("news.viewAllNews")}
              >
                {t("news.viewAllNews")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-lg shadow-sm">
            <p className="text-slate-600">{t("news.noArticlesFound")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentNews;
