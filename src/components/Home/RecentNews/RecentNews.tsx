import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NewsArticle } from "../../../services/interfaces";
import { fetchNewsArticles } from "../../../services/api";
import NewsItem from "./NewsItem";

const RecentNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsArticles({ limit: 3 });
        setArticles(data);
        setLoading(false);
      } catch (err) {
        setError("Error loading news articles. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecentArticles();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest News
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Stay updated with our latest news and developments
            </p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center text-indigo-600 font-medium mt-4 md:mt-0 hover:text-indigo-800 transition-colors"
            aria-label="View all news"
          >
            View all news
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-red-600">{error}</div>
        )}

        {!loading && !error && articles.length === 0 && (
          <p className="text-slate-600">No articles found</p>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsItem key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentNews;
