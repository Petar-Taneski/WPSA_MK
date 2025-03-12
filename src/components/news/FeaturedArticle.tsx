import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewsArticle } from "../../services/api";

interface FeaturedArticleProps {
  article: NewsArticle;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const { t } = useTranslation();
  const { id, title, summary, imageUrl, publishDate, author, tags } = article;

  // Format the date to be more readable
  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden">
      <div className="relative flex flex-col lg:flex-row">
        {/* Featured Image */}
        <div className="lg:w-3/5 h-64 sm:h-80 lg:h-auto overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Featured Content */}
        <div className="lg:w-2/5 p-6 lg:p-8 flex flex-col justify-center">
          <div className="mb-3 flex items-center space-x-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
              {t("news.featured")}
            </span>
            {tags.length > 0 && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                #{tags[0]}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h2>

          <p className="text-gray-700 mb-4 line-clamp-3">{summary}</p>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span>{formattedDate}</span>
            <span>{author}</span>
          </div>

          <Link
            to={`/news/${id}`}
            className="mt-auto self-start inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t("news.readFullArticle")}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
