import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NewsArticle } from "../../services/api";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const { t } = useTranslation();
  const { id, title, summary, thumbnailUrl, publishDate, author, tags } =
    article;

  // Format the date to be more readable
  const formattedDate = new Date(publishDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="relative overflow-hidden">
        {/* Image with zoom effect on hover */}
        <div className="h-48 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Tag labels */}
        {tags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[70%]">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Date label */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Title with hover effect */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {title}
        </h2>

        {/* Summary text */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{summary}</p>

        {/* Footer section */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Author */}
          <span className="text-xs text-gray-500 italic">{author}</span>

          {/* Read more link */}
          <Link
            to={`/news/${id}`}
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors group-hover:translate-x-1 duration-300"
          >
            {t("news.readMore")}
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
