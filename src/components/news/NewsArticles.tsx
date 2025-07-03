import { useNews } from "@/providers/news";
import { useInfiniteNews } from "@/hooks/useInfiniteNews";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import EmptyState from "./EmptyState";
import NewsCard from "./NewsCard";
import FilterBar from "./FilterBar";

export default function NewsArticles() {
  const { t, i18n } = useTranslation();
  const { activeFilter, searchQuery } = useNews();
  const [displayedCount, setDisplayedCount] = useState(3); // How many articles to show
  const [loadingMore, setLoadingMore] = useState(false);

  const ARTICLES_PER_PAGE = 3; // 3 articles per load

  // Use the existing infinite news hook with custom page size
  const { flat, error, size, setSize, isEnd, isLoading } = useInfiniteNews(
    i18n.language,
    activeFilter,
    15 // Fetch 15 from Firebase at a time (we'll display 3 at a time)
  );

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return flat;

    return flat.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.author ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [flat, searchQuery]);

  // Get articles to display
  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, displayedCount);
  }, [filteredArticles, displayedCount]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(3);
  }, [activeFilter, searchQuery, i18n.language]);

  // Check if we have more articles to show
  const hasMoreToShow = useMemo(() => {
    // More articles in filtered results
    const hasMoreFiltered = displayedCount < filteredArticles.length;
    // More articles can be fetched from Firebase
    const canFetchMore = !isEnd;
    return hasMoreFiltered || canFetchMore;
  }, [displayedCount, filteredArticles.length, isEnd]);

  // Load more articles
  const loadMoreArticles = async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    try {
      const newCount = displayedCount + ARTICLES_PER_PAGE;

      // If we need more articles than we have in filtered results, fetch more from Firebase
      if (newCount > filteredArticles.length && !isEnd) {
        await setSize(size + 1);
      }

      // Update displayed count
      setDisplayedCount(newCount);
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (isLoading && displayedArticles.length === 0) {
    return (
      <>
        <FilterBar />
        <div className="flex justify-center py-8">
          <div className="text-gray-500">{t("common.loading")}</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <FilterBar />
        <div className="p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
          {t("news.errorLoading")}
        </div>
      </>
    );
  }

  return (
    <>
      <FilterBar />

      {displayedArticles.length === 0 && <EmptyState />}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {displayedArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreToShow && displayedArticles.length > 0 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMoreArticles}
            disabled={loadingMore || isLoading}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loadingMore || isLoading ? (
              <span className="flex items-center">
                <svg className="mr-2 w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("common.loading")}
              </span>
            ) : (
              t("news.loadMore")
            )}
          </button>
        </div>
      )}

      {/* No more articles message */}
      {!hasMoreToShow && displayedArticles.length > 0 && (
        <div className="mt-8 text-center text-gray-500">
          {t("news.noMoreArticles")}
        </div>
      )}
    </>
  );
}
