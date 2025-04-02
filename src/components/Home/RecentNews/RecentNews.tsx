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
  useEffect(() => {
    console.log(currentLanguage);
  }, []);

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
      <div className="w-full py-12">
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
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-white bg-red-500/20 backdrop-blur-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {t("news.recentTitle")}
          </h2>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            {t("news.recentDescription")}
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="timeline-container relative max-w-5xl mx-auto pb-12">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-400 rounded hidden md:block"></div>

              {/* News items */}
              <div className="space-y-16 md:space-y-24">
                {articles.map((article, index) => (
                  <NewsItem
                    key={article.id}
                    article={article}
                    position={index % 2 === 0 ? "left" : "right"}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to={getNewsPath()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                aria-label={t("news.viewAllNews")}
              >
                {t("news.viewAllNews")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
            <p className="text-white">{t("news.noArticlesFound")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentNews;
