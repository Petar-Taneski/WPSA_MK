import ArrowButton from "@/components/common/ArrowButton";
import NewsCard from "@/components/News/NewsCard";
import { NewsArticle } from "@/services/interfaces";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchNewsArticles } from "../../../services/api";

const RecentNews = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const navigate = useNavigate();
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
      <div className="w-full bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="px-4 py-3 text-red-600 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl text-primary/85">
          {t("news.recentTitle")}
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-slate-600/80">
          {t("news.recentDescription")}
        </p>
      </div>

      {articles.length > 0 ? (
        <>
          {/* Equal height card layout */}
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-stretch justify-center gap-10 md:grid md:grid-cols-3 lg:gap-12">
              {articles.map((article) => (
                <div key={article.id} className="flex flex-col">
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <ArrowButton
              text={t("news.viewAllNews")}
              onClick={() => navigate(getNewsPath())}
            />
          </div>
        </>
      ) : (
        <div className="py-10 text-center rounded-lg shadow-sm bg-slate-50">
          <p className="text-slate-600">{t("news.noArticlesFound")}</p>
        </div>
      )}
    </section>
  );
};

export default RecentNews;
