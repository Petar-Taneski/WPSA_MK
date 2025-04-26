import { useNews } from "@/contexts/NewsContext";
import EmptyState from "./EmptyState";
import NewsCard from "./NewsCard";
import FilterBar from "./FilterBar";

export default function NewsArticles() {
  const { filteredArticles } = useNews();

  return (
    <>
      <FilterBar />

      {filteredArticles.length === 0 && <EmptyState />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12">
        {/* TODO: Add loader for seperate categories */}
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}
