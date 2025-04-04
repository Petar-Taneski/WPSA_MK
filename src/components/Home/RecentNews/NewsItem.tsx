import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NewsArticle } from "../../../services/api";
import { ArrowRight, User } from "lucide-react";

interface NewsItemProps {
  article: NewsArticle;
  index: number;
}

const NewsItem = ({ article }: NewsItemProps) => {
  const { t } = useTranslation();

  const formattedDate = new Date(article.publishDate).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 border border-slate-100">
        {/* Image container - fixed height */}
        <div className="w-full h-44 relative">
          <Link
            to={`/news/${article.id}`}
            className="block w-full h-full overflow-hidden relative cursor-pointer group"
            aria-label={`View article: ${article.title}`}
          >
            <div className="absolute inset-0 rounded-t-xl overflow-hidden">
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            </div>

            {/* Tags overlay - simplified to just one tag */}
            {article.tags.length > 0 && (
              <div className="absolute top-3 right-3">
                <span className="inline-block rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white">
                  {article.tags[0]}
                </span>
              </div>
            )}

            {/* Date overlay */}
            <div className="absolute bottom-3 left-3">
              <span className="inline-block rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {formattedDate}
              </span>
            </div>
          </Link>
        </div>

        {/* Content section - fixed height layout */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title - fixed height */}
          <div className="h-12 mb-2">
            <Link to={`/news/${article.id}`} className="group">
              <h3 className="text-base font-medium line-clamp-2 text-slate-900 group-hover:text-slate-700 transition-colors">
                {article.title}
              </h3>
            </Link>
          </div>

          {/* Summary - fixed height with ellipsis */}
          <div className="h-12 mb-4">
            <p className="text-xs text-slate-500 line-clamp-3">
              {article.summary}
            </p>
          </div>

          {/* Author + CTA row - fixed position at bottom */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 italic truncate max-w-[50%] flex items-center">
              <User className="w-3 h-3 mr-1 text-slate-400 flex-shrink-0" />
              <span className="truncate">{article.author}</span>
            </span>

            <Link
              to={`/news/${article.id}`}
              className="inline-flex items-center text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors whitespace-nowrap"
            >
              {t("news.readMore")}
              <ArrowRight className="ml-1 w-3 h-3 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
