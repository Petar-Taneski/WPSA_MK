import React, { useEffect, useRef } from "react";
import { useInfiniteNews } from "../../hooks/useInfiniteNews";
import { AdminCard } from "./AdminCard";
import { NewsArticle } from "../../services/interfaces";

interface NewsSectionProps {
  onEdit: (item: NewsArticle) => void;
  onDelete: (id: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  onEdit,
  onDelete,
}) => {
  const { flat, error, size, setSize, isEnd, isLoading } = useInfiniteNews(
    "en",
    null
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isEnd) {
          setSize(size + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [size, setSize, isLoading, isEnd]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600">Error loading news articles</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flat.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-gray-500">
          No news articles found
        </div>
      ) : (
        <>
          {flat.map((article) => (
            <AdminCard
              key={article.id}
              item={article}
              type="news"
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {/* Load more trigger */}
          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center"
          >
            {isLoading && (
              <div className="text-gray-500 text-sm">
                Loading more articles...
              </div>
            )}
            {isEnd && flat.length > 0 && (
              <div className="text-gray-400 text-sm">No more articles</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
