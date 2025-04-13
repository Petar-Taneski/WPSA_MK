import React from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "../../services/interfaces";
import { formatDate } from "../../utils/dateUtils";

interface NewsCardProps {
  article: NewsArticle;
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { id, title, summary, thumbnailUrl, publishDate, tags } = article;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/news/${id}`} className="block">
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        ></div>
      </Link>
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/news/${id}`}>
          <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-indigo-600">
            {title}
          </h3>
        </Link>
        <p className="text-gray-700 mb-4">{truncateText(summary, 120)}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {formatDate(publishDate)}
          </span>
          <Link
            to={`/news/${id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
