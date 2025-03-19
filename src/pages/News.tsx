import { useTranslation } from "react-i18next";
import { useNews } from "../contexts/NewsContext";

// Import modular components
import FeaturedArticle from "../components/news/FeaturedArticle";
import SearchFilterBar from "../components/news/SearchFilterBar";
import NewsListView from "../components/news/NewsListView";
import EmptyState from "../components/news/EmptyState";
import LoadingState from "../components/news/LoadingState";
import NewsCard from "../components/news/NewsCard";

const News = () => {
  const { t } = useTranslation();
  const { loading, error, featuredArticle, filteredArticles, viewMode } =
    useNews();

  return (
    <div className="page news-page max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {t("navigation.news")}
        </h1>
        <p className="text-xl text-gray-600">{t("news.latestUpdates")}</p>
      </div>

      {/* Loading state */}
      {loading && <LoadingState />}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}

          <SearchFilterBar />

          {filteredArticles.length === 0 && <EmptyState />}

          {viewMode === "grid" && filteredArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {viewMode === "list" && filteredArticles.length > 0 && (
            <NewsListView articles={filteredArticles} />
          )}
        </>
      )}
    </div>
  );
};

export default News;
