import React from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../../services/interfaces";
import { formatDate } from "../../utils/dateUtils";

interface FeaturedArticleProps {
  article: NewsArticle;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const { id, title, summary, imageUrl, publishDate, tags } = article;

  return (
    <div className="mb-12 relative overflow-hidden bg-white rounded-xl shadow-lg">
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
          Featured News
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="order-2 md:order-1 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            {title}
          </h2>

          <p className="text-gray-600 mb-6 line-clamp-3">{summary}</p>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {formatDate(publishDate)}
            </span>
            <Link
              to={`/news/${id}`}
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Read Full Article
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2 h-60 md:h-auto">
          <Link to={`/news/${id}`}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
