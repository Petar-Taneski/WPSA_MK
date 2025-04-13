import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NewsArticle } from "../../../services/interfaces";
import { formatDate } from "../../../utils/dateUtils";

interface NewsItemProps {
  article: NewsArticle;
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
  const { id, title, summary, thumbnailUrl, publishDate } = article;

  return (
    <div className="h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link to={`/news/${id}`} className="block overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
        />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-sm text-gray-500">
            {formatDate(publishDate)}
          </span>
        </div>
        <Link to={`/news/${id}`} className="block mb-3">
          <h3 className="font-bold text-xl text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        <div className="mt-auto">
          <Link
            to={`/news/${id}`}
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            Read more
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
