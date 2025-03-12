import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewsArticle } from "../../services/api";

interface NewsListViewProps {
  articles: NewsArticle[];
}

const NewsListView = ({ articles }: NewsListViewProps) => {
  const { t } = useTranslation();

  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <div
          key={article.id}
          className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className="sm:w-1/3 h-48 sm:h-auto">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="sm:w-2/3 p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {formatDate(article.publishDate)}
              </span>
              <span className="text-xs text-gray-500">{article.author}</span>
            </div>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {article.title}
            </h2>

            <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/news/${article.id}`}
                className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
              >
                {t("news.readMore")} →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsListView;
