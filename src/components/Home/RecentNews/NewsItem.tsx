import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NewsArticle } from "../../../services/api";
import { ArrowRight, Calendar, User } from "lucide-react";

interface NewsItemProps {
  article: NewsArticle;
  position: "left" | "right";
  index: number;
}

const NewsItem = ({ article, position }: NewsItemProps) => {
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
    <div
      className={`relative flex md:flex-row flex-col items-center mb-8 md:mb-0 ${
        position === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Timeline dot - visible only in md screens and larger */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white shadow-md z-10 items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Date marker - visible only on mobile */}
      <div className="md:hidden flex items-center space-x-2 mb-3 text-white bg-slate-700 px-3 py-1.5 rounded-full shadow">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{formattedDate}</span>
      </div>

      {/* Card - takes full width on mobile, half width on desktop */}
      <div
        className={`w-full md:w-5/12 ${
          position === "right" ? "md:pl-8" : "md:pr-8"
        }`}
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
          {/* Image container with fixed height - now clickable */}
          <Link
            to={`/news/${article.id}`}
            className="h-48 sm:h-56 overflow-hidden relative block cursor-pointer group"
            aria-label={`View article: ${article.title}`}
          >
            <div className="absolute inset-0 rounded-t-xl overflow-hidden">
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Image overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
            </div>

            {/* Overlay with date - desktop only */}
            <div className="absolute bottom-3 left-3 hidden md:block">
              <span className="inline-block rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {formattedDate}
              </span>
            </div>

            {/* Tags overlay */}
            {article.tags.length > 0 && (
              <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1 max-w-[70%]">
                {article.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white shadow"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>

          <div className="p-5 sm:p-6 flex flex-col flex-grow relative z-10">
            {/* Author - desktop view */}
            <div className="hidden md:flex items-center space-x-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 shadow">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-xs text-slate-600 italic truncate max-w-[80%]">
                {article.author}
              </span>
            </div>

            {/* Title */}
            <Link to={`/news/${article.id}`} className="group">
              <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-slate-900 group-hover:text-slate-700 transition-colors">
                {article.title}
              </h3>
            </Link>

            {/* Summary */}
            <p className="text-slate-600 mb-4 line-clamp-3 flex-grow">
              {article.summary}
            </p>

            {/* Mobile author display */}
            <div className="md:hidden flex items-center space-x-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 shadow">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-xs text-slate-600 italic truncate max-w-[80%]">
                {article.author}
              </span>
            </div>

            {/* CTA Button */}
            <Link
              to={`/news/${article.id}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 text-white font-medium transition-all duration-300 hover:bg-slate-700 hover:shadow w-full md:w-auto"
            >
              {t("news.readMore")}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Empty space for desktop layout */}
      <div className="hidden md:block w-5/12"></div>
    </div>
  );
};

export default NewsItem;
